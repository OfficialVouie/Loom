import { doc, getDoc, serverTimestamp, writeBatch } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ASSET_SYNC_QUEUE_COLLECTION = "discordAssetSyncQueue";

function cleanString(value, fallback = "") {
    if (value === undefined || value === null) {
        return fallback;
    }
    const normalized = String(value).trim();
    return normalized || fallback;
}

function truncate(value, max = 1800) {
    const normalized = cleanString(value);
    if (!normalized) {
        return "";
    }
    return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
}

function isHttpUrl(value) {
    return /^https?:\/\//i.test(cleanString(value));
}

function buildAssetLink(assetId) {
    return new URL(`asset.html?id=${encodeURIComponent(assetId)}`, window.location.href).toString();
}

function pickAnnouncementImage(asset = {}) {
    const candidates = [
        asset.iconUrl,
        ...(Array.isArray(asset.galleryImages) ? asset.galleryImages : []),
    ];

    return candidates.find((value) => isHttpUrl(value)) || null;
}

function normalizeVersion(value, fallback = "") {
    return cleanString(value, fallback).toLowerCase();
}

function getConfiguredWebhookUrl() {
    const injected = cleanString(window.LOOM_DISCORD_WEBHOOK_URL || "");
    if (injected) {
        return injected;
    }

    const isLocalDevHost = window.location.protocol.startsWith("http")
        && ["127.0.0.1", "localhost"].includes(window.location.hostname);

    try {
        const stored = cleanString(window.localStorage?.getItem("loom.discordWebhookUrl") || "");
        if (stored && isLocalDevHost) {
            return stored;
        }
    } catch (_) {
        // Ignore storage access issues.
    }

    if (isLocalDevHost) {
        return "http://127.0.0.1:3000/webhooks/assets";
    }

    if (window.location.protocol.startsWith("http")) {
        return new URL("/webhooks/assets", window.location.origin).toString();
    }

    return "";
}

function getAnnouncementTarget(assetData = {}) {
    const currentVersion = cleanString(assetData.version, "v1.0.0");
    const lastAnnouncedVersion = normalizeVersion(assetData.discordLastAnnouncedVersion);
    const hasReleaseAnnouncement = Boolean(
        cleanString(assetData.discordReleaseAnnouncedAt)
        || cleanString(assetData.discordReleaseMessageId)
        || cleanString(assetData.discordAnnouncementAnnouncedAt)
        || cleanString(assetData.discordAnnouncementMessageId)
    );

    if (!hasReleaseAnnouncement) {
        return { eventType: "release", version: currentVersion };
    }

    if (lastAnnouncedVersion && normalizeVersion(currentVersion) === lastAnnouncedVersion) {
        return { eventType: "update", version: currentVersion, skip: true, reason: "version-already-announced" };
    }

    return { eventType: "update", version: currentVersion };
}

function buildQueuePayload(assetId, assetData = {}, actorId = "", eventType = "release", version = "v1.0.0") {
    const title = cleanString(assetData.name || assetData.title, assetId);
    const descriptionSource = eventType === "update"
        ? assetData.releaseNotes || assetData.summary || assetData.description
        : assetData.summary || assetData.description;
    const description = truncate(descriptionSource, 3500)
        || (eventType === "update" ? "A Loom asset just received a new update." : "A new asset just released on Loom.");
    const compatibility = cleanString(assetData.compatibility, "Not specified");
    const category = cleanString(assetData.tag, "Not specified");
    const creatorName = cleanString(assetData.creatorName || assetData.username, "Loom Creator");

    return {
        assetId,
        eventType,
        title,
        description,
        version,
        releaseNotes: cleanString(assetData.releaseNotes, ""),
        unityVersion: compatibility,
        renderPipeline: category,
        specPrimaryLabel: "Compatibility",
        specSecondaryLabel: "Category",
        link: buildAssetLink(assetId),
        imageUrl: pickAnnouncementImage(assetData),
        creatorName,
        username: creatorName,
        discordUserId: cleanString(assetData.discordUserId || assetData.creatorDiscordUserId || "", ""),
        source: "website",
        status: "pending",
        queuedBy: cleanString(actorId, ""),
        queuedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
}

function shouldSkipQueue(assetData = {}, target = null) {
    const currentStatus = cleanString(assetData.discordAnnouncementStatus).toLowerCase();
    if (currentStatus !== "pending") {
        return false;
    }

    const currentVersion = normalizeVersion(assetData.version, "v1.0.0");
    const queuedVersion = normalizeVersion(assetData.discordAnnouncementQueuedVersion);
    const targetVersion = normalizeVersion(target?.version, currentVersion);
    return !queuedVersion || queuedVersion === targetVersion;
}

function buildAnnouncementStatePatchFromWebhook(result = {}, eventType = "release", version = "v1.0.0") {
    const patch = {
        discordAnnouncementEventType: eventType,
        discordAnnouncementError: "",
    };

    if (result.deduped && result.existingAnnouncement) {
        patch.discordAnnouncementStatus = "duplicate";
        patch.discordAnnouncementDuplicateAt = serverTimestamp();
        patch.discordAnnouncementMessageId = cleanString(result.existingAnnouncement.discordMessageId, "");
        patch.discordAnnouncementChannelId = cleanString(result.existingAnnouncement.channelId, "");
        patch.discordAnnouncementGuildId = cleanString(result.existingAnnouncement.guildId, "");
        patch.discordLastAnnouncedVersion = cleanString(result.existingAnnouncement.version, version);
        if (eventType === "update") {
            patch.discordUpdateMessageId = cleanString(result.existingAnnouncement.discordMessageId, "");
            patch.discordUpdateChannelId = cleanString(result.existingAnnouncement.channelId, "");
        } else {
            patch.discordReleaseMessageId = cleanString(result.existingAnnouncement.discordMessageId, "");
            patch.discordReleaseChannelId = cleanString(result.existingAnnouncement.channelId, "");
        }
        return patch;
    }

    if (result.record) {
        patch.discordAnnouncementStatus = "announced";
        patch.discordAnnouncementAnnouncedAt = serverTimestamp();
        patch.discordAnnouncementMessageId = cleanString(result.record.discordMessageId, "");
        patch.discordAnnouncementChannelId = cleanString(result.record.channelId, "");
        patch.discordAnnouncementGuildId = cleanString(result.record.guildId, "");
        patch.discordLastAnnouncedVersion = cleanString(result.record.version, version);
        if (eventType === "update") {
            patch.discordUpdateAnnouncedAt = serverTimestamp();
            patch.discordUpdateMessageId = cleanString(result.record.discordMessageId, "");
            patch.discordUpdateChannelId = cleanString(result.record.channelId, "");
        } else {
            patch.discordReleaseAnnouncedAt = serverTimestamp();
            patch.discordReleaseMessageId = cleanString(result.record.discordMessageId, "");
            patch.discordReleaseChannelId = cleanString(result.record.channelId, "");
        }
    }

    return patch;
}

async function tryDirectWebhookDelivery({ db, assetRef, queueRef, assetId, assetData, eventType, version }) {
    const webhookUrl = getConfiguredWebhookUrl();
    if (!webhookUrl) {
        return null;
    }

    try {
        const webhookPayload = buildQueuePayload(assetId, assetData, "", eventType, version);
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...webhookPayload,
                creatorDiscordUserId: webhookPayload.discordUserId,
                creatorUsername: webhookPayload.username,
            }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload?.ok) {
            throw new Error(cleanString(payload?.error, `Webhook request failed with status ${response.status}.`));
        }

        const batch = writeBatch(db);
        batch.set(assetRef, buildAnnouncementStatePatchFromWebhook(payload, eventType, version), { merge: true });
        batch.delete(queueRef);
        await batch.commit();
        return payload;
    } catch (error) {
        console.warn("[Loom] Direct Discord webhook delivery failed, leaving Firestore queue pending:", error);
        return null;
    }
}

export async function queueAssetDiscordAnnouncement({ db, assetId, assetData, actorId = "" }) {
    if (!db) {
        throw new Error("Missing Firestore instance.");
    }

    const normalizedAssetId = cleanString(assetId);
    if (!normalizedAssetId) {
        throw new Error("Missing asset ID for Discord sync.");
    }

    if (!assetData || cleanString(assetData.moderationStatus).toLowerCase() !== "approved") {
        return { queued: false, skipped: true, reason: "not-approved" };
    }

    const target = getAnnouncementTarget(assetData);

    if (shouldSkipQueue(assetData, target)) {
        return {
            queued: false,
            skipped: true,
            reason: cleanString(assetData.discordAnnouncementStatus).toLowerCase() || "already-queued",
        };
    }

    if (target.skip) {
        return { queued: false, skipped: true, reason: target.reason, eventType: target.eventType };
    }

    const assetRef = doc(db, "assets", normalizedAssetId);
    const queueRef = doc(db, ASSET_SYNC_QUEUE_COLLECTION, normalizedAssetId);
    const payload = buildQueuePayload(normalizedAssetId, assetData, actorId, target.eventType, target.version);
    const batch = writeBatch(db);

    batch.set(queueRef, payload, { merge: true });
    batch.set(assetRef, {
        discordAnnouncementStatus: "pending",
        discordAnnouncementEventType: target.eventType,
        discordAnnouncementQueuedBy: cleanString(actorId, ""),
        discordAnnouncementQueuedAt: serverTimestamp(),
        discordAnnouncementQueuedVersion: target.version,
        discordAnnouncementError: "",
    }, { merge: true });

    await batch.commit();
    const webhookResult = await tryDirectWebhookDelivery({
        db,
        assetRef,
        queueRef,
        assetId: normalizedAssetId,
        assetData,
        eventType: target.eventType,
        version: target.version,
    });
    return { queued: true, payload, eventType: target.eventType, directResult: webhookResult };
}

export async function queueAssetDiscordAnnouncementById({ db, assetId, actorId = "" }) {
    if (!db) {
        throw new Error("Missing Firestore instance.");
    }

    const normalizedAssetId = cleanString(assetId);
    if (!normalizedAssetId) {
        throw new Error("Missing asset ID for Discord sync.");
    }

    const assetSnap = await getDoc(doc(db, "assets", normalizedAssetId));
    if (!assetSnap.exists()) {
        throw new Error("Asset not found for Discord sync.");
    }

    return queueAssetDiscordAnnouncement({
        db,
        assetId: normalizedAssetId,
        assetData: assetSnap.data(),
        actorId,
    });
}
