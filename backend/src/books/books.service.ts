import { Injectable } from '@nestjs/common';
import axios from 'axios';

function getRandomQuery() {
  const words = [
    'Conduct of life',
    'Youthfulness',
    'Portraits',
    'Apparence (Philosophie)',
    'Romans, nouvelles',
    'Morale pratique',
    'Juvénilité',
    'General',
    'Horror',
    'Education',
    'English literature',
    'England, fiction',
    'Fiction, general',
    'Soul',
    'Paranormal fiction',
    'Fiction, psychological',
    'Didactic fiction',
    'Drama (dramatic works by one author)',
    'Fiction, historical',
    'Fiction, fantasy, paranormal',
    'Great britain, fiction',
  ];
  return words[Math.floor(Math.random() * words.length)];
}

@Injectable()
export class BooksService {
  async getRandomExternalBooks() {
    const q = getRandomQuery();
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${q}&sort=random&limit=10`,
      );
      return res.data.docs;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  async getExternalBooksByCategoryName(categoryName: string) {
    try {
      const res = await axios.get(
        `https://openlibrary.org/subjects/${categoryName}.json?limit=10`,
      );
      return res.data.works;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  async searchExternalBooks(searchText: string) {
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchText)}&limit=10`,
      );
      return res.data.docs;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }
}
