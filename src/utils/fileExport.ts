// @ts-nocheck
import { Capacitor, registerPlugin } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


/**
* Cross-platform file export utility for Web & Android Capacitor APK
* Directly saves/downloads files into the user's phone Downloads folder without opening share dialogs
*/
var NativeDownloader = registerPlugin("NativeDownloader");
export async function exportFile({ filename, content, mimeType }) {
	if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
		try {
			const res = await NativeDownloader.downloadFile({
				filename,
				content,
				mimeType
			});
			if (res && res.success) return {
				success: true,
				method: "download",
				uri: res.uri
			};
			if (res && res.canceled) return {
				success: false,
				method: "download",
				canceled: true
			};
		} catch (pluginErr) {
			console.warn("NativeDownloader plugin error, attempting Filesystem fallback:", pluginErr);
		}
		try {
			try {
				if ((await Filesystem.checkPermissions()).publicStorage !== "granted") await Filesystem.requestPermissions();
			} catch {}
			try {
				return {
					success: true,
					method: "download",
					uri: (await Filesystem.writeFile({
						path: filename,
						data: content,
						directory: Directory.Documents,
						encoding: Encoding.UTF8,
						recursive: true
					})).uri
				};
			} catch {
				return {
					success: true,
					method: "download",
					uri: (await Filesystem.writeFile({
						path: `Download/${filename}`,
						data: content,
						directory: Directory.ExternalStorage,
						encoding: Encoding.UTF8,
						recursive: true
					})).uri
				};
			}
		} catch (fsErr) {
			console.warn("Filesystem fallback failed:", fsErr);
		}
	}
	try {
		const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", filename);
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		}, 400);
		return {
			success: true,
			method: "download"
		};
	} catch (err) {
		console.error("Browser download failed:", err);
		return {
			success: false,
			method: "download",
			error: err?.message || "Download failed"
		};
	}
}
