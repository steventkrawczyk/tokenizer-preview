import React from 'react';

interface TokenProps {
    token: string;
    color: string;
}

export const COLORS = [
    '#E53E3E', // Red-600
    '#DD6B20', // Orange-500
    '#38A169', // Green-500
    '#3182CE', // Blue-500
    '#805AD5', // Purple-500
    '#D53F8C', // Pink-500
    '#F6E05E', // Yellow-300 for lightness
    '#718096', // Gray-500 for a neutral option
];


export const Token: React.FC<TokenProps> = ({ token, color }) => {
    return (
        <span style={{ color }} className="mr-2 text-white">
            {token}
        </span>
    );
};