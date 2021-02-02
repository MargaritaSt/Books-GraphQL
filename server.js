const express = require('express');

const expressGraphQL = require('express-graphql').graphqlHTTP

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');

const app = express();
let authors = [
  {id:1, name: "Taga Fggg"},
  {id:2, name: "Ghhh Jems"},
  {id:3, name: "Anna Meler"},
  {id:4, name: "Klon Fgdl"}
]
let books = [
  {id: 1, name: "qqqqqqqqqq", authorId: 1 },
  {id: 2, name: "dddddddddddd", authorId: 1 },
  {id: 3, name: "gghghhhhhhhhhhh", authorId: 2 },
  {id: 4, name: ",mmmmmmmmmmmmmm", authorId: 2 },
  {id: 5, name: "vvvvvvvvvvv", authorId: 4 },
  {id: 6, name: "nnnnnnnnnn", authorId: 3},
  {id: 7, name: "xxxxxxxxxxxxx", authorId: 4 },
  {id: 8, name: "zzzzzzzzz", authorId: 3 },
  {id: 9, name: "gggggggggg", authorId: 1 },
]

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an Author of a book',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an autor',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    authorId: {type: GraphQLNonNull(GraphQLInt)},
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId )
      }
    } 
  })
})

const RootQueryType = new GraphQLObjectType ({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A single Book',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all Books',
      resolve: () => books
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of all Authors',
      resolve: () => authors
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an Author ',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
      },
      resolve: (parent, args) => {
        const author = {id: authors.length + 1, name: args.name}
        authors.push(author)
        return author
      }
    },
    DeleteAuthor: {
      type: AuthorType,
      description: 'Delete an Author ',
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const author = {id: args.id}
        const filterAuthor = authors.filter(object => object.id !== args.id)
        authors=filterAuthor;
        return author
      }
    },
    DeleteBook: {
      type: BookType,
      description: 'Delete a Book ',
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const book = {id: args.id}
        const filterBook = books.filter(object => object.id !== args.id)
        books=filterBook;
        return book
      }
    }
    // UpdateBook: {
    //   type: BookType,
    //   description: 'Update a Book ',
    //   args: {
    //     id: { type: GraphQLNonNull(GraphQLInt)},
    //     name: {type: GraphQLNonNull(GraphQLString)},
    //     authorId:{type: GraphQLNonNull(GraphQLInt)}
    //   },
    //   resolve: (parent, args) => {
    //     const book = {name: args.name, authorId: args.authorId}
    //     const UpdateBook = books.map(object => {
    //       if (object.id === args.id ) {
    //         object.name = args.name;
    //         object.id = object.id;
    //         object.authorId=args.authorId; 
    //       } else {
    //         object.name = object.name;
    //         object.id = object.id;
    //         object.authorId=object.authorId; 
    //       }
    //      })
    //     books=UpdateBook;
    //     return book
    //   }
    // }
  })
})


const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true,
}),
);
app.listen(5000., () => (console.log('Server is runing on 5000')));

