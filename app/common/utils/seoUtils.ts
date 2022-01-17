const hostName = "https://toolbox.shogitter.com";

export function getTwitterMetas({title, description, img}: { title: string, description: string, img: Image }) {
    return ({
        "twitter:title": title,
        "twitter:description": description,
        "twitter:card": "summary_large_image",
        "twitter:creator": "@na2hiro",
        "twitter:image:src": img.url.startsWith("https") ? img.url : `${hostName}${img.url}`,
        "twitter:image:width": `${img.width}`,
        "twitter:image:height": `${img.height}`,
    });
}

type Image = {
    url: string;
    width: number;
    height: number;
}
export function getOpenGraphMetas({title, description, img}: { title: string, description: string, img: Image }) {
    return {
        "og:title": title,
        "og:site_name": "Shogi Toolbox",
        "og:url": hostName,
        "og:description": description,
        "og:type": "website",
        "og:image": img.url,
    }
}
