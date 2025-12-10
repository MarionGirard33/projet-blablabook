import { Injectable } from '@nestjs/common';
import axios from 'axios';

function getRandomQuery() {
  const words = [
    'Science',
    'Fantasy',
    'Adventure',
    'Mystery',
    'Biography',
    'Travel',
    'Comics',
    'Romance',
    'History',
    'Children',
    'Young adult',
    'Thriller',
    'Cooking',
    'Music',
    'Technology',
    'Nature',
    'Animals',
    'Space',
    'Friendship',
    'Family',
    'Crime',
    'Humor',
    'Drama',
    'Science fiction',
    'Horror',
    'Magic',
    'Mythology',
    'Education',
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
