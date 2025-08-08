import { type Quote, type InsertQuote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getRandomQuote(): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  getAllQuotes(): Promise<Quote[]>;
}

export class MemStorage implements IStorage {
  private quotes: Map<string, Quote>;

  constructor() {
    this.quotes = new Map();
    
    // Initialize with some sample quotes
    this.initializeQuotes();
  }

  private initializeQuotes() {
    const sampleQuotes = [
      "A recipe is just a suggestion until you make it your own.",
      "The secret ingredient is always love, but a little garlic doesn't hurt.",
      "Cooking is like coding - one missing semicolon and everything breaks.",
      "A watched pot never boils, but an unwatched one always overflows.",
      "Life is too short for instant coffee and frozen dinners.",
      "The best meals are made with friends and laughter.",
      "Mistakes in the kitchen are just undiscovered recipes.",
      "A messy kitchen is a sign of happiness.",
      "Good food is the foundation of genuine happiness.",
      "In the kitchen, we trust our instincts and taste buds."
    ];

    sampleQuotes.forEach(text => {
      const id = randomUUID();
      const quote: Quote = {
        id,
        text,
        createdAt: new Date()
      };
      this.quotes.set(id, quote);
    });
  }



  async getRandomQuote(): Promise<Quote | undefined> {
    const quotesArray = Array.from(this.quotes.values());
    if (quotesArray.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    return quotesArray[randomIndex];
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = {
      id,
      text: insertQuote.text,
      createdAt: new Date()
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
