const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language')

const typeDefs = gql`
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
    }
`;


const books = [{
     
    id:1,
    title: 'The Death of Ivan Llyich and Other Stories',
    author: 'Leo Tolstoy',
    releaseDate: new Date('17-05-1886'),
    rating: 5
},
{ 
    id:2,
    title: 'Nothing is True and Everything is Possible',
    author: 'Peter Pomerantsev',
    releaseDate: new Date('01-01-2015'),
    rating: 5
},
{
    id:3,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    releaseDate: new Date('01-05-2018'),
    rating: 3
}

]

const resolvers = {
    Query: {
        books: () => {
            return books;
        },
        book: (obj, { id }, context, info) => {
            console.log(id);
            return books.find( book => book.id == id);
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

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`Server started on ${url}`);
});