import thumbnail from "~/junisen/thumbnail.png";

const imgUrl = "https://toolbox.shogitter.com"+thumbnail;

const description = "順位戦の結果の組み合わせを数え上げます。";

function getTwitterMetas({title}: {title: string}) {
    return ({
        "twitter:title": title,
        "twitter:description": description,
        "twitter:card": "summary_large_image",
        "twitter:creator": "@na2hiro",
        "twitter:image:src": imgUrl,
        "twitter:image:width": "676",
        "twitter:image:height": "667",
    });
}

function getOpenGraphMetas({title}: { title: string }) {
    return {
        "og:title": title,
        "og:site_name": "Shogi Toolbox",
        "og:url": "https://toolbox.shogitter.com",
        "og:description": description,
        "og:type": "website",
        "og:image": imgUrl,
    }
}

export function getJunisenMetas({title}: { title: string }) {
    return {
        title,
        ...getTwitterMetas({title}),
        ...getOpenGraphMetas({title}),
    }
}
