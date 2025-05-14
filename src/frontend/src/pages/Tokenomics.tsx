import React from "react";
import Markdown from "react-markdown"
import TokenomicEn from "../docs/Tokenomic.en.md?raw";
import TokenomicEs from "../docs/Tokenomic.es.md?raw";
import remarkGfm from "remark-gfm";


type Props = {
    language: string
}

const Tokenomics: React.FC<Props> = ({ language }) => {
    
    const tokenomicsMap: Record<string, string> = {
        en: TokenomicEn,
        es: TokenomicEs,
    };

    const Tokenomic = tokenomicsMap[language] || TokenomicEn;

    return (
        <div className=" p-4 ml-1 max-w-[1000px] text-white border border-white">
            <Markdown  remarkPlugins={[remarkGfm]}>{Tokenomic}</Markdown>
        </div>
    );
};

export default Tokenomics;
