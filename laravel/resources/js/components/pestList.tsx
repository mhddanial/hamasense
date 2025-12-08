import React from "react";
import PestCard from "./pestCard";
import { pest } from "../types/pest";

interface PestListProps {
    pests: pest[];
}

const PestList: React.FC<PestListProps> = ({ pests }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pests.map((pest) => (
                <PestCard key={pest.id} pest={pest} />
            ))}
        </div>
    );
};

export default PestList;
