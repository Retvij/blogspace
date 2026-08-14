const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('[Seed] Checking existing data...');
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seed] Populating initial curriculum demo data...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const userJohn = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: passwordHash,
      bio: 'Full-stack developer, open source contributor, and tech writer.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const userJane = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: passwordHash,
      bio: 'Frontend enthusiast, React developer, and UI designer.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    });

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'JavaScript', slug: 'javascript', description: 'Core JS, modern ES6+ features, and async programming.' },
      { name: 'React.js', slug: 'react', description: 'React hooks, state management, and modern component architectures.' },
      { name: 'Node.js & Express', slug: 'nodejs', description: 'Backend servers, REST APIs, and middleware development.' },
      { name: 'Databases & MongoDB', slug: 'databases', description: 'Mongoose schemas, indexing, and CRUD query design.' },
    ]);

    const [catJS, catReact, catNode, catDB] = categories;

    // 3. Create Sample Posts
    const posts = await Post.insertMany([
      {
        title: 'Mastering JavaScript Async/Await and Promises in 2026',
        slug: 'mastering-javascript-async-await-promises',
        excerpt: 'A clean and practical guide to understanding asynchronous JavaScript execution, event loops, and error handling.',
        content: `Asynchronous programming is one of the most essential concepts in modern JavaScript development. In this guide, we will explore how promises and async/await simplify asynchronous code.

### 1. The Power of Promises
Before Promises, JavaScript developers relied heavily on nested callback functions, often leading to callback hell. A Promise represents an eventual completion (or failure) of an asynchronous operation and its resulting value.

### 2. Cleaner Code with Async/Await
Introduced in ES2017, the async and await keywords allow you to write asynchronous code that reads like synchronous code, making debugging and maintenance far more intuitive.

### Conclusion
By mastering promises and async/await, you can build reliable, responsive web applications that gracefully handle network requests and background tasks.`,
        coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=1200&q=80',
        author: userJohn._id,
        category: catJS._id,
        tags: ['JavaScript', 'ES6', 'Async'],
        readTime: 4,
      },
      {
        title: 'Building Modern React Components with Hooks and State',
        slug: 'building-modern-react-components-hooks-state',
        excerpt: 'Learn how to architect reusable, declarative React functional components utilizing useState, useEffect, and custom hooks.',
        content: `React has fundamentally changed how we build user interfaces. With functional components and React Hooks, managing state and component lifecycles has never been easier.

### 1. Understanding Functional Components
Functional components are JavaScript functions that accept props and return JSX. They are concise, easy to test, and have become the industry standard.

### 2. State Management with useState
The useState hook lets you add state variables to functional components without needing class components. Combined with useEffect, you can handle side-effects like fetching data from REST APIs.

### 3. Custom Hooks
Custom hooks let you extract and reuse stateful logic across multiple components, keeping your codebase DRY and modular.`,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
        author: userJane._id,
        category: catReact._id,
        tags: ['React', 'Hooks', 'Frontend'],
        readTime: 5,
      },
      {
        title: 'Designing Robust RESTful APIs with Node.js and Express',
        slug: 'designing-robust-restful-apis-nodejs-express',
        excerpt: 'Best practices for organizing routes, controllers, custom middlewares, and secure JWT authentication in Express.',
        content: `Express.js remains the most popular lightweight backend framework for Node.js. In this article, we cover how to build production-ready REST APIs.

### 1. Modular Controller and Route Architecture
Structuring your application by separating routes from controller logic makes scaling simple. Each route maps directly to a controller function.

### 2. Middleware Execution
Middlewares are functions that have access to the request and response objects. They are ideal for logging, request validation, authentication, and error handling.

### 3. Securing Endpoints with JWT
JSON Web Tokens (JWT) provide a stateless, secure way to authenticate requests between the client and server.`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        author: userJohn._id,
        category: catNode._id,
        tags: ['NodeJS', 'Express', 'Backend', 'JWT'],
        readTime: 6,
      },
      {
        title: 'Effective Data Modeling and CRUD Queries with MongoDB & Mongoose',
        slug: 'effective-data-modeling-mongodb-mongoose',
        excerpt: 'How to structure schemas, implement references, validate data, and perform optimized CRUD operations.',
        content: `MongoDB is a flexible document-oriented database that pairs seamlessly with Node.js. Mongoose provides a straightforward, schema-based solution to model your application data.

### 1. Schema Definitions
Defining clear schemas with validation rules ensures data integrity before records are written to the database.

### 2. Relationships with Population
Using ObjectId references and Mongoose populate allows you to connect posts with authors and categories effortlessly.

### Summary
With proper indexing and modular models, MongoDB delivers exceptional performance for modern web applications.`,
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
        author: userJane._id,
        category: catDB._id,
        tags: ['MongoDB', 'Mongoose', 'Database', 'CRUD'],
        readTime: 5,
      },
    ]);

    // 4. Create Sample Comments
    await Comment.create([
      {
        post: posts[0]._id,
        author: userJane._id,
        content: 'Great article John! The section on async/await error handling was super helpful.',
      },
      {
        post: posts[1]._id,
        author: userJohn._id,
        content: 'Awesome explanation of custom hooks Jane! Very clear and easy to follow.',
      },
    ]);

    console.log('[Seed] Initial data populated successfully!');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
  }
};

module.exports = seedData;

if (require.main === module) {
  seedData().then(() => {
    console.log('Seeding completed. Exiting.');
    process.exit(0);
  });
}
