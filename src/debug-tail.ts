import axios from 'axios';
import * as mpdParser from 'mpd-parser';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TOKEN;
const batchId = process.env.BATCH_ID;
const lectureId = '6867e4a9f122c94c3b3d70de'; // AS 13 ... 09

const headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    'client-id': '5eb393ee95fab7468a79d189',
    'client-type': 'WEB',
    'client-version': '4.5.3',
    'randomid': '948f0288-e2ea-4cd4-80eb-56503c8a2c10',
    'referer': 'https://www.pw.live/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
};

async function checkSpecific(idx: number, type: 'v'|'a' = 'a') {
    const detailsRes = await axios.get(`https://api.penpencil.co/v1/videos/video-url-details?type=BATCHES&videoContainerType=DASH&reqType=query&childId=${lectureId}&parentId=${batchId}&clientVersion=201`, { headers });
    const { url, signedUrl } = detailsRes.data.data;
    
    let mpdUrl = url;
    if (signedUrl) mpdUrl = url.includes('?') ? (url + signedUrl.replace('?', '&')) : (url + signedUrl);

    const mpdRes = await axios.get(mpdUrl, { headers });
    const parsedMpd = mpdParser.parse(mpdRes.data, { manifestUri: mpdUrl });
    
    const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
    const signature = signedUrl;

    let playlist: any;
    if (type === 'a') {
        const audioGroup = parsedMpd.mediaGroups.AUDIO;
        const group = Object.values(audioGroup)[0] as any;
        const topLevelPlaylist = Object.values(group)[0] as any;
        playlist = topLevelPlaylist.playlists[0];
    } else {
        const availablePlaylists = (parsedMpd.playlists as any[]).sort((a, b) => (b.attributes.RESOLUTION?.height || 0) - (a.attributes.RESOLUTION?.height || 0));
        playlist = availablePlaylists[availablePlaylists.length - 1]; // Low res
    }
    
    const seg = playlist.segments[idx];
    const targetUrl = baseUrl + seg.uri + signature;
    console.log(`Checking ${type === 'a' ? 'Audio' : 'Video'} Index ${idx}: ${targetUrl.substring(0, 100)}...`);
    
    try {
        console.log("Testing with axios (10s timeout)...");
        const res = await axios.get(targetUrl, { headers, timeout: 10000 });
        console.log(`Success! Status: ${res.status}, Size: ${res.data.length}\n`);
    } catch (e: any) {
        console.log(`Failed! Status: ${e.response?.status}, Error: ${e.message}\n`);
    }
}

async function runTests() {
    await checkSpecific(521, 'a');
    await checkSpecific(545, 'v');
}

runTests();
