import thumbnail from "~/junisen/thumbnail.png";
import {getOpenGraphMetas, getTwitterMetas} from "~/common/utils/seoUtils";

const img = {
    url: "https://toolbox.shogitter.com" + thumbnail,
    width: 676,
    height: 667
};

const description = "順位戦の結果の組み合わせを数え上げます。";

export function getJunisenMetas({title}: { title: string }) {
    return {
        title,
        ...getTwitterMetas({title, description, img}),
        ...getOpenGraphMetas({title, description, img}),
    }
}
