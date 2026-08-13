export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  readingTime: string;
  datePublished: string;
  dateModified: string;
  quickAnswer: string;
  takeaways: string[];
  table?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  sections: GuideSection[];
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ name: string; url: string }>;
  related: string[];
};

const publishDate = '2026-08-11T09:00:00+01:00';

export const guides: Guide[] = [
  {
    slug: 'internet-speed-4k-sports',
    title: 'Internet Speed for 4K Sports Streaming: Calculator & Guide',
    shortTitle: 'Internet speed for 4K sports',
    description: 'Calculate the practical internet speed needed for SD, HD, 4K, and 8K IPTV, including multiple streams, Wi-Fi overhead, and other household traffic.',
    category: 'Network performance',
    readingTime: '8 min read',
    datePublished: publishDate,
    dateModified: publishDate,
    quickAnswer: 'Plan for roughly 5 Mbps for SD, 10–15 Mbps for one HD stream, 25–35 Mbps for one 4K stream, and 60–100 Mbps for one 8K stream. These are planning ranges, not guarantees: codec, frame rate, provider bitrate, Wi-Fi quality, and simultaneous household use all change the result.',
    takeaways: [
      'Test speed on the streaming device itself, not only on a phone beside the router.',
      'Add at least 25% headroom above the combined bitrate of every simultaneous stream.',
      'Stability, packet loss, and Wi-Fi interference matter even when headline download speed looks high.',
      'Ethernet is the cleanest diagnostic test for a TV that buffers over Wi-Fi.',
    ],
    table: {
      caption: 'Practical planning ranges per active stream',
      headers: ['Picture quality', 'Typical resolution', 'Planning range', 'Safer household target'],
      rows: [
        ['SD', '480p', '3–5 Mbps', '10 Mbps+'],
        ['HD', '720p–1080p', '8–15 Mbps', '25 Mbps+'],
        ['4K UHD', '2160p', '25–35 Mbps', '50 Mbps+'],
        ['8K', '4320p', '60–100 Mbps', '100–150 Mbps+'],
      ],
    },
    sections: [
      {
        id: 'calculate',
        title: 'Use a household calculation, not a single-stream minimum',
        paragraphs: [
          'A speed requirement printed by a streaming service usually describes one active stream under good conditions. Real homes also have phones syncing photos, laptops downloading updates, game consoles, cameras, and other viewers. That traffic shares the same connection and often the same Wi-Fi airtime.',
          'A practical estimate is: add the planning bitrate for every simultaneous stream, add other predictable heavy traffic, then multiply the result by 1.25 for headroom. Two 4K streams planned at 30 Mbps each need 60 Mbps before overhead. With 25% headroom, the connection should deliver at least 75 Mbps consistently to the devices—not merely advertise that tier on the bill.',
        ],
        callout: 'Example: two 4K streams (60 Mbps) + one HD stream (10 Mbps) + 10 Mbps for other activity = 80 Mbps. Add 25% headroom for a practical target of about 100 Mbps.',
      },
      {
        id: 'speed-vs-stability',
        title: 'Why a fast speed test can still buffer',
        paragraphs: [
          'A speed test measures a short transfer to a nearby test server. Streaming is a sustained transfer from a different network path. Brief packet loss, latency spikes, crowded Wi-Fi channels, or an overloaded device can empty the playback buffer even when the speed-test number is impressive.',
          'Run several tests at the exact device location, including during the evening when the problem normally occurs. Compare Wi-Fi with Ethernet if possible. If Ethernet is smooth but Wi-Fi is not, buying a faster internet plan is unlikely to be the first fix; improve signal, channel selection, access-point placement, or wired connectivity instead.',
        ],
        bullets: [
          'Test at different times, especially when buffering normally appears.',
          'Compare the TV or streaming box with a second device in the same room.',
          'Watch for large swings between tests, not only the best result.',
          'Check whether the issue affects every service or only one channel or app.',
        ],
      },
      {
        id: 'wifi',
        title: 'Choose the right home-network connection',
        paragraphs: [
          'Ethernet avoids most radio interference and is preferred for a fixed 4K television when cabling is practical. A good 5 GHz or 6 GHz Wi-Fi connection can also handle high-bitrate video, but its shorter range and sensitivity to walls make placement important. The 2.4 GHz band reaches farther but is often crowded and offers less usable throughput.',
          'Do not judge Wi-Fi by the number of signal bars alone. A nearby router hidden behind a television, inside a cabinet, or beside other electronics may perform worse than a properly placed access point. Mesh systems help coverage only when each node has a strong backhaul connection; adding more poorly connected nodes can add delay rather than remove it.',
        ],
      },
      {
        id: 'data-usage',
        title: 'Account for data usage and provider limits',
        paragraphs: [
          'Higher quality uses more data. Actual consumption depends on the encoded bitrate and whether the player adapts quality as conditions change. As a rough conversion, a sustained 10 Mbps stream transfers about 4.5 GB per hour, while 30 Mbps is about 13.5 GB per hour. The calculation is bitrate multiplied by 3,600 seconds, divided by eight bits per byte.',
          'If your broadband plan has a monthly data allowance, check the provider dashboard rather than relying on a generic estimate. Automatic quality may reduce consumption during congestion, while a fixed high-quality setting can use considerably more.',
        ],
      },
      {
        id: 'checklist',
        title: 'A five-minute readiness checklist',
        paragraphs: [
          'Start with the simplest evidence. Confirm that the device is connected to the intended network, run a test on that device, and play a known reliable stream. Then repeat over Ethernet or close to the router. This separates internet-capacity problems from local Wi-Fi and device problems before you change plans or equipment.',
        ],
        bullets: [
          'Confirm the device supports the target resolution and codec.',
          'Measure delivered speed at the device during peak viewing time.',
          'Leave at least 25% capacity above expected simultaneous use.',
          'Use Ethernet or strong 5 GHz/6 GHz Wi-Fi for 4K where possible.',
          'Contact support with time, device, connection type, and affected channels if the issue persists.',
        ],
      },
    ],
    faqs: [
      { question: 'Is 25 Mbps enough for IPTV in 4K?', answer: 'It can be enough for one efficiently encoded 4K stream under stable conditions, but 35–50 Mbps of delivered capacity gives more room for bitrate peaks and other household traffic.' },
      { question: 'Does IPTV need fast upload speed?', answer: 'Normal viewing relies mainly on download speed. Upload still matters for acknowledgements and other household activities such as video calls, cloud backup, and security cameras.' },
      { question: 'Will changing DNS increase streaming speed?', answer: 'DNS mainly affects the initial lookup of a service. It rarely fixes sustained buffering after playback starts. Test Wi-Fi, packet loss, device load, and the stream source first.' },
    ],
    sources: [
      { name: 'Netflix-recommended internet speeds', url: 'https://help.netflix.com/en/node/306' },
      { name: 'Apple TV model and connectivity specifications', url: 'https://support.apple.com/en-us/101605' },
    ],
    related: ['stop-sports-buffering', '4k-hdr-sports-setup', 'best-device-live-sports'],
  },
  {
    slug: 'stop-sports-buffering',
    title: 'How to Stop Live Sports Buffering: A Diagnostic Guide',
    shortTitle: 'Stop sports buffering',
    description: 'Diagnose IPTV buffering step by step by separating internet, Wi-Fi, device, app, and provider-side causes instead of trying random fixes.',
    category: 'Troubleshooting',
    readingTime: '10 min read',
    datePublished: publishDate,
    dateModified: publishDate,
    quickAnswer: 'First determine the scope: one channel, one app, one device, or the whole home. Then test the affected device over Ethernet, restart only after recording the symptoms, lower quality temporarily, and compare at the same time of day. This sequence identifies the failing layer faster than changing DNS or repeatedly reinstalling apps.',
    takeaways: [
      'One bad channel usually points somewhere different from every app buffering on every device.',
      'An Ethernet comparison is more useful than a speed test alone.',
      'Record the time, channel, device, and connection before contacting support.',
      'Avoid factory resets until network and provider-side causes have been isolated.',
    ],
    table: {
      caption: 'What the pattern of buffering usually tells you to test next',
      headers: ['Observed pattern', 'Most useful next test', 'Likely area'],
      rows: [
        ['One channel only', 'Try another channel at the same quality', 'Feed or channel source'],
        ['One app only', 'Update app; clear cache; try another device', 'App or device'],
        ['One device only', 'Ethernet test; restart; check storage', 'Device or local Wi-Fi'],
        ['Every device', 'Test modem/router and ISP performance', 'Home network or ISP'],
        ['Evenings only', 'Repeat wired test at peak time', 'Congestion or Wi-Fi load'],
      ],
    },
    sections: [
      {
        id: 'scope',
        title: 'Step 1: define exactly what is buffering',
        paragraphs: [
          'Before changing anything, test a second channel, a second app, and—if available—a second device. A single affected channel suggests a feed-specific issue. One affected app suggests app state or compatibility. One affected device suggests local Wi-Fi, storage, decoding, or software. If every service buffers on every device, focus on the router, modem, or internet connection.',
          'Write down when the problem begins, how often it repeats, and whether audio continues while video freezes. These details make later tests comparable and give support teams evidence they can use.',
        ],
      },
      {
        id: 'network-test',
        title: 'Step 2: compare Wi-Fi with a wired connection',
        paragraphs: [
          'Connect the affected device to Ethernet when possible, even temporarily. If playback becomes stable, the stream and internet connection may be adequate while the Wi-Fi path is not. Move the router into the open, use a less congested band, or improve access-point placement before paying for a faster package.',
          'If Ethernet also buffers, test the delivered speed and consistency during the problem period. A connection can average well but dip below the stream bitrate every few seconds. Large variation, packet loss, or simultaneous downloads can be more important than the maximum result.',
        ],
        bullets: [
          'Pause cloud backups, game downloads, and large software updates.',
          'Restart the modem and router in the correct order if they have been running abnormally.',
          'Avoid placing a router behind the TV or inside a closed cabinet.',
          'Use quality-of-service settings only if you understand the router; poor rules can reduce throughput.',
        ],
      },
      {
        id: 'device',
        title: 'Step 3: check device heat, storage, and codec support',
        paragraphs: [
          'Small streaming sticks can slow down when storage is nearly full, background apps accumulate, or the device overheats behind a television. Restart the device, close unused apps, remove software you no longer use, and install current system updates. Use the supplied power adapter when the manufacturer recommends it; an underpowered TV USB port can cause unstable behaviour.',
          'A device can output 4K without decoding every 4K codec, profile, frame rate, or HDR format. If HD plays smoothly but a specific 4K stream does not, compare the stream format with the hardware specification before assuming the internet connection is the only cause.',
        ],
      },
      {
        id: 'app',
        title: 'Step 4: reset the app carefully',
        paragraphs: [
          'Update the player, then clear its cache if the operating system provides that option. Clearing all app data or reinstalling may remove playlists, sign-in details, and settings, so record what you need first. Test with quality set to Auto or HD. If that works, increase quality gradually to find the stable threshold.',
          'Changing DNS can help when a service hostname fails to resolve, but it does not normally increase the sustained bandwidth of an active stream. A VPN can either improve or worsen routing; test with and without it only where lawful and permitted by the service terms, and compare under the same conditions.',
        ],
      },
      {
        id: 'escalate',
        title: 'Step 5: escalate with evidence',
        paragraphs: [
          'When local tests do not resolve the issue, send support a compact diagnostic record: account identifier, device model, app version, wired or wireless connection, approximate speed at the device, affected channel names, local time, and whether other services worked. Do not send passwords or full payment details.',
          'Evidence helps distinguish a regional route, service incident, channel source, or account issue. It also prevents repeating basic troubleshooting that you have already completed.',
        ],
        callout: 'Useful support note: “At 20:15 local time, Channel A buffered every 30 seconds on Apple TV over Ethernet. Channel B and a separate streaming app were stable. Device speed test: 92 Mbps.”',
      },
    ],
    faqs: [
      { question: 'Why does IPTV buffer only at night?', answer: 'Evening problems can come from ISP congestion, heavier household use, crowded neighbourhood Wi-Fi, or event-driven demand. Repeat the same wired test during the day and evening to isolate the pattern.' },
      { question: 'Does a VPN stop IPTV buffering?', answer: 'Not reliably. A VPN adds encryption and another network route. It may bypass a poor route in some cases but can also reduce speed and increase latency. Follow local law and service terms.' },
      { question: 'Should I clear app data or only cache?', answer: 'Start with cache. Clearing data usually signs you out and removes settings. Record account and configuration details before using the stronger reset.' },
    ],
    sources: [
      { name: 'Netflix network speed and device testing guidance', url: 'https://help.netflix.com/en/node/306' },
      { name: 'Amazon Fire TV device specifications', url: 'https://developer.amazon.com/docs/device-specs/device-specifications-fire-tv-streaming-media-player.html' },
    ],
    related: ['internet-speed-4k-sports', 'best-device-live-sports', '4k-hdr-sports-setup'],
  },
  {
    slug: 'best-device-live-sports',
    title: 'Best Streaming Device for Live Sports: Fire TV vs Apple TV',
    shortTitle: 'Best live-sports device',
    description: 'Compare IPTV device types by 4K support, Ethernet, app flexibility, codec compatibility, storage, updates, and ease of use.',
    category: 'Device compatibility',
    readingTime: '9 min read',
    datePublished: publishDate,
    dateModified: publishDate,
    quickAnswer: 'Choose by workflow, not brand alone. Apple TV suits viewers who value polished navigation and long-term performance; current Fire TV devices offer compact, accessible setups; certified Android or Google TV devices provide broad app flexibility; built-in smart-TV apps reduce hardware but can receive slower updates and have limited storage.',
    takeaways: [
      'Verify the exact model year; devices with similar names can support different codecs and Wi-Fi standards.',
      'For fixed 4K setups, built-in or adapter-based Ethernet is a major reliability advantage.',
      'A 4K badge does not guarantee every codec, HDR format, or frame rate will play.',
      'Certified devices and official app stores reduce security and compatibility risk.',
    ],
    table: {
      caption: 'Device-type comparison for common IPTV priorities',
      headers: ['Device type', 'Best fit', 'Main strength', 'Check before buying'],
      rows: [
        ['Apple TV 4K', 'Polished premium setup', 'Performance and Ethernet option', 'App/player workflow'],
        ['Fire TV', 'Compact value setup', 'Simple TV integration', 'Exact model and storage'],
        ['Android/Google TV', 'App flexibility', 'Wide hardware choice', 'Certification and updates'],
        ['Smart TV app', 'No extra box', 'One remote, fewer cables', 'App availability and support'],
      ],
    },
    sections: [
      {
        id: 'criteria',
        title: 'The seven specifications that actually matter',
        paragraphs: [
          'Start with output resolution, hardware video decoding, HDR formats, network connection, memory, storage, and software support. Marketing names often stay similar across generations while the hardware changes. Always identify the exact model number and year before relying on a compatibility claim.',
          'For live television, fast channel changes and stable decoding matter more than a large app catalogue alone. For high-bitrate 4K, Ethernet or excellent Wi-Fi and hardware HEVC or AV1 decoding can matter more than processor benchmark scores.',
        ],
        bullets: [
          'Maximum output: 1080p, 4K30, 4K60, and supported HDR formats.',
          'Hardware codecs: H.264/AVC, H.265/HEVC, VP9, and AV1 where relevant.',
          'Networking: Ethernet speed, Wi-Fi generation, and antenna performance.',
          'Available storage after the operating system and preinstalled apps.',
          'Official updates, app-store access, DRM certification, and vendor support.',
        ],
      },
      {
        id: 'apple-tv',
        title: 'Apple TV 4K: strong performance and a clean interface',
        paragraphs: [
          'Apple TV 4K is a good fit when responsive navigation, ecosystem integration, and a mature app environment matter. The third-generation Wi-Fi + Ethernet model includes Gigabit Ethernet, while the Wi-Fi-only model does not. Apple lists support up to 4K60 across HDR10, HDR10+, and Dolby Vision on current third-generation hardware.',
          'The main decision is whether the required IPTV player and sign-in method are available in the App Store and work with your provider. Check that workflow before purchase rather than assuming every playlist or portal format is accepted by every player.',
        ],
      },
      {
        id: 'fire-tv',
        title: 'Fire TV: compact and widely accessible',
        paragraphs: [
          'Fire TV sticks are easy to place behind a television and offer a familiar setup for many households. Specifications vary substantially by generation: some models target HD, while 4K models add higher output, HDR, newer codecs, and faster Wi-Fi. Limited internal storage can become a constraint if many apps and caches accumulate.',
          'Ethernet commonly requires a compatible adapter and may run at a different speed from the device Wi-Fi. Use the manufacturer power supply, leave ventilation around the stick, and verify the current app-installation policy in your market.',
        ],
      },
      {
        id: 'android-tv',
        title: 'Android TV and Google TV: flexible, but hardware quality varies',
        paragraphs: [
          'Certified Android TV and Google TV devices range from inexpensive sticks to premium boxes. The platform offers broad player choice, but two devices using the same operating system can have very different processors, codec support, storage, Ethernet, and update commitments.',
          'Look for official certification, a recognized manufacturer, a current security-patch policy, and the required DRM level for legitimate premium services. Avoid unknown boxes that ship with unverifiable subscriptions, modified stores, or promises of permanent access to copyrighted content.',
        ],
      },
      {
        id: 'smart-tv',
        title: 'Built-in smart-TV apps: convenient, with a shorter support horizon',
        paragraphs: [
          'A native app avoids another box and remote, but television processors and app platforms may age faster than the display panel. App availability differs by television brand, model year, and country. Storage is often limited, and clearing cache or updating a player may be less straightforward.',
          'If the built-in app is stable and supports the required sign-in method, it can be the simplest option. If navigation is slow or the app is no longer maintained, an external certified streamer is usually cheaper than replacing a good television.',
        ],
      },
    ],
    faqs: [
      { question: 'Is a streaming box better than a smart-TV app?', answer: 'Often for long-term app support and responsiveness, but not always. A well-supported native app can be perfectly suitable. Compare the exact television model and required player.' },
      { question: 'Do I need an 8K device for IPTV?', answer: 'Only if you have legitimate 8K content, an 8K display, and enough network capacity. Most live and on-demand libraries remain HD or 4K, so codec support and stability are usually more valuable.' },
      { question: 'How much storage does an IPTV device need?', answer: 'Streaming itself does not store the full programme, but apps, guide data, artwork, updates, and cache use space. Choose enough free storage to keep the operating system healthy.' },
    ],
    sources: [
      { name: 'Apple Support: identify Apple TV models', url: 'https://support.apple.com/en-us/101605' },
      { name: 'Amazon developer specifications for Fire TV devices', url: 'https://developer.amazon.com/docs/device-specs/device-specifications-fire-tv-streaming-media-player.html' },
    ],
    related: ['4k-hdr-sports-setup', 'internet-speed-4k-sports', 'stop-sports-buffering'],
  },
  {
    slug: '4k-hdr-sports-setup',
    title: '4K HDR Sports Streaming Checklist: TV, Device, HDMI and Network',
    shortTitle: '4K HDR sports checklist',
    description: 'Verify every link in a 4K IPTV setup—from the stream and decoder to HDMI, television settings, HDR, and network capacity.',
    category: '4K and 8K quality',
    readingTime: '8 min read',
    datePublished: publishDate,
    dateModified: publishDate,
    quickAnswer: 'A 4K label is only the beginning. The source must be genuine 2160p, the device must decode its codec and profile, the HDMI path must support the format, the TV input must be configured for enhanced bandwidth, and the network must sustain the bitrate. One incompatible link can reduce quality or cause playback failure.',
    takeaways: [
      'Confirm actual output information on the player or television; do not judge only by picture sharpness.',
      'Match codec, frame rate, bit depth, and HDR profile—not just 3840 × 2160 resolution.',
      'Use a suitable HDMI port and cable, and enable the TV manufacturer’s enhanced-input setting if required.',
      'Test a known 4K source before blaming a single IPTV channel.',
    ],
    table: {
      caption: 'End-to-end 4K signal checklist',
      headers: ['Link', 'What to verify', 'Common symptom when wrong'],
      rows: [
        ['Source', 'Genuine 2160p bitrate and format', 'Soft or upscaled image'],
        ['Decoder', 'Codec/profile/HDR support', 'Black screen or stutter'],
        ['HDMI path', 'Port, cable, receiver bandwidth', '4K30 only; HDR missing'],
        ['Display', 'Enhanced input and picture mode', 'Wrong colour or no HDR flag'],
        ['Network', 'Stable delivered throughput', 'Buffering or quality drops'],
      ],
    },
    sections: [
      {
        id: 'source',
        title: '1. Verify the stream is genuinely 4K',
        paragraphs: [
          'A player can label an output 4K because the device is sending a 2160p signal even when the source video is HD and being upscaled. Use the player information panel, codec details, or television diagnostics to check source resolution and frame rate where available.',
          'Live sports at 50 or 60 frames per second can be more demanding than a 24 fps film. Bitrate and encoder quality also affect detail: two streams with the same resolution can look very different during fast movement.',
        ],
      },
      {
        id: 'decoder',
        title: '2. Match the codec, profile, frame rate, and HDR format',
        paragraphs: [
          'The streaming device needs hardware support for the exact video format. HEVC Main 10, AV1, VP9 Profile 2, HDR10, HDR10+, HLG, and Dolby Vision are separate capabilities. A device may support 4K HEVC but not 4K AV1, or HDR10 but not a particular Dolby Vision profile.',
          'Hardware decoding is preferable because software decoding of high-resolution video can overload smaller devices. Symptoms include dropped frames, audio drift, overheating, or playback that works in HD but fails in 4K.',
        ],
      },
      {
        id: 'hdmi',
        title: '3. Check the complete HDMI path',
        paragraphs: [
          'Connect the streamer to a television input that supports the target resolution and frame rate. Some televisions reserve full-bandwidth features for specific ports or require an “enhanced,” “deep colour,” or similarly named input setting. Consult the television manual because terminology differs.',
          'If an AV receiver, soundbar, switch, or capture device sits between streamer and television, every component and cable must pass the format. Bypass intermediate equipment temporarily when diagnosing missing HDR, black screens, or a 4K30 limit.',
        ],
      },
      {
        id: 'network',
        title: '4. Prove the network under real conditions',
        paragraphs: [
          'Test at the streaming device during the viewing period. For one 4K stream, a practical planning range of 25–35 Mbps plus headroom is sensible, although individual services can use less or more. Ethernet removes Wi-Fi interference from the diagnosis.',
          'If the player uses adaptive quality, a network dip may lower resolution without obvious buffering. Check the stream information after several minutes, not just at startup.',
        ],
      },
      {
        id: 'picture',
        title: '5. Confirm television output and picture settings',
        paragraphs: [
          'Look for the television’s HDR or Dolby Vision indicator, output-resolution screen, or signal information. Avoid excessive sharpness and motion processing when evaluating source quality, because both can create artifacts that resemble compression problems.',
          'For sports, a consistent frame rate and correct motion handling may improve perceived quality more than maximum sharpness. For films, correct dynamic range and frame-rate matching can prevent washed-out colour or uneven motion.',
        ],
        callout: 'Fast isolation test: play a trusted 4K title in a major app on the same device, HDMI port, and network. If that succeeds, the hardware path is capable and the issue is more likely specific to the player or source.',
      },
    ],
    faqs: [
      { question: 'Why does my TV say 4K when the picture looks HD?', answer: 'The device may be outputting a 4K signal while upscaling a lower-resolution source. Check the player’s source resolution and bitrate, not only the television input label.' },
      { question: 'Do I need HDMI 2.1 for IPTV in 4K?', answer: 'Not for ordinary 4K60 video in many setups; HDMI 2.0-class bandwidth can be sufficient. Requirements depend on frame rate, bit depth, chroma, HDR, and every component in the signal path.' },
      { question: 'Why is HDR missing on a 4K stream?', answer: 'The source may be SDR, the device may not support that HDR profile, the HDMI path may not pass it, or the television input may need an enhanced-mode setting.' },
    ],
    sources: [
      { name: 'Apple TV model, HDMI, HDR, and network specifications', url: 'https://support.apple.com/en-us/101605' },
      { name: 'Amazon Fire TV codec and HDR specifications', url: 'https://developer.amazon.com/docs/device-specs/device-specifications-fire-tv-streaming-media-player.html' },
      { name: 'Netflix UHD connection baseline', url: 'https://help.netflix.com/en/node/306' },
    ],
    related: ['best-device-live-sports', 'internet-speed-4k-sports', 'stop-sports-buffering'],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
