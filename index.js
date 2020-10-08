const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')
const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {useNewUrlParser: true,useCreateIndex: true,
    useUnifiedTopology: true, })

const db = mongoose.connection;

const bookSchema = new mongoose.Schema({
    title: String,
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Author'
    },
    releaseDate: Date,
    rating: Number,
    status: String
  });


const Book = mongoose.model('Book', bookSchema);


const authorShema = new mongoose.Schema({
    name: String,
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
})

const Author = mongoose.model('Author', authorShema);



// gql`` parses your string into AST
const typeDefs = gql`

    # Write this in your frond end of playground
    
    fragment Meta on Book {
        releaseDate
        rating
    }
    scalar Date

    enum Status {
        READ 
        INTERESTED
        NOT_INTERESTED
    }

    type Author {
        id: ID!
        name: String
        books: [Book] # valid null, [] or [...some data] x not valid [ some data without book schema]
        # books [Book]! there needs to be an array valid [] or [...some data]
        # books [Book!]! # valid [...somedata]
    }
    
    type Book {
        id: ID!
        title: String
        author: Author
        releaseDate: Date
        rating: Int
        status: Status
        # fake1 float
        # fake2 boolean 
    }

    type Query {
        books: [Book]
        book(id: ID): Book
        authors: [Author]
        author(id: ID): Author
    }

    input BookInput {
        title: String
        author: ID
        releaseDate: Date
        rating: Int
        status: Status
    }

    type Mutation {
        addBook(data:BookInput):Book
        addAuthor(name: String):Author
    }
`;


const authors = [
{
    id: 1,
    name: 'Leo Tolstoy'
},
{
    id: 2,
    name: 'Peter Pomerantsev'
},
{
  id: 3,
  name: 'Eric Ries',

}

]

const books = [{
     
    id:1,
    title: 'The Death of Ivan Llyich and Other Stories',
    author: 1,
    releaseDate: new Date('17-05-1886'),
    rating: 5
},
{ 
    id:2,
    title: 'Nothing is True and Everything is Possible',
    author: 2,
    releaseDate: new Date('01-01-2015'),
    rating: 5
},
{
    id:3,
    title: 'The Lean Startup',
    author: 3,
    releaseDate: new Date('01-05-2018'),
    rating: 3
}

]

const resolvers = {
    Query: {
        books: async () => {
            const books = await Book.find();
            return books;
        },
        book: async  (obj, { id }, context, info) => {
         const book = await Book.findById({ _id: id});
         return book;
        },
        authors: async () => {
             const authors = await Author.find();
             return authors;
        },
        author: async (obj, { id }, context, info) => {
            const author = await Author.findById({_id: id});
            return author;
           
        }
    },
    Author: {
        books: async (obj, args, context, info ) => {
            console.log('running');
            const books = await Book.find({  author: obj.id})
            return books;
        }
    },
    Book: {
        author: async (obj, args, context, info) => {
            const author = await Author.findById({_id: obj.author});
            console.log(author);
            return author;
        }
    },
    Mutation: {
        addBook: async (obj, { data }, { userId }, info) => {
            console.log(data);
            if (userId) {
            const newBook = await  Book.create({
                ...data
               })
                return newBook;
            }

            throw new Error('Please log in...')
        },
        addAuthor: async (obj, args, context, info) => {
            
            const newAuthor = await Author.create({
                ...args
            })
            console.log(newAuthor);

            return newAuthor;
        }
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: "It's a date, deal with it",
        parseValue(value) {
         // value from the client
         return new Date(value);
        },
        serialize(value) {
         // value sent to the client 
         return value.getTime()
        },
        parseLiteral(ast) {
            if (ast.kind === kind.INT) {
                return new Date(ast.value);
            }
            return null
        }
    })
}

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context:({ req }) => {
        const fakeUser ={
            userId: 'hello'
        }
        return {
            ...fakeUser
        }
    }
});


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected');
    server
        .listen()
        .then(({ url }) => {
            console.log(`Server started on ${url}`);
    });
});

