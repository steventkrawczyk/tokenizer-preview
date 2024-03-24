'use client'
import React, { useState } from 'react';
import { COLORS, Token } from './token';

interface TokenizerProps {
    tokenize: (text: string) => void;
    result: string[];
    ready: boolean | null;
}

const Tokenizer: React.FC<TokenizerProps> = ({ tokenize, result, ready }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handlePreview = () => {
    tokenize(inputText);
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md text-black"
        rows={4}
        value={inputText}
        onChange={handleInputChange}
      ></textarea>
      <button
        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={handlePreview}
      >
        Preview
      </button>
      <div className="mt-4">
      {ready !== null && (
        <>{ (!ready || !result) ? 
        'Loading...' : 
        <>
            {result.map((token, index) => (
              <Token key={index} token={token} color={COLORS[index % COLORS.length]} />
            ))}
        </>
      }</>)}
      </div>
    </div>
  );
};

export default Tokenizer;
