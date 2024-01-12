import React, { useState } from 'react';
import axios from 'axios';

const TruecallerSearch = () => {
  const [numbers, setNumbers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newNumbers = inputValue
      .split(/\r?\n/)
      .filter((number) => number.trim() !== '');

    setNumbers(newNumbers);
    setSearchResults([]);

    newNumbers.forEach((number) => {
      axios
        .get(`https://api.truecaller.com/v4/phone_numbers/search`, {
          params: {
            number,
            country_code: 'US', // Change this to the desired country code.
            format: 'basic',
            limit: 1,
            offset: 0,
            skip_incomplete_numbers: true,
            spellcheck: true,
            api_key: 'YOUR_API_KEY', // Replace with your Truecaller API key.
          },
        })
        .then((response) => {
          const results = [...searchResults];
          results.push(response.data.phone_numbers[0]);
          setSearchResults(results);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <textarea value={inputValue} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>
            {result.number} - {result.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TruecallerSearch;