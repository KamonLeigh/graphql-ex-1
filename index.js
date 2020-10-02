const { ApolloServer, gql } = require('apollo-server');

const tyoeDefs = gql`
    type Book {
        title: String
        author: String
        releaseDate: String
        rating: Int
    }
`;


const books = [{
    title: 'The Death of Ivan Llyich and Other Stories',
    author: 'Leo Tolstoy',
    releaseDate: '1886',
    rating: 5
},
{
    title: 'Nothing is True and Everything is Possible',
    author: 'Peter Pomerantsev',
    releaseDate: '1886',
    rating: 5
},
{
    title: 'The Death of Ivan Llyich and Other Stories',
    author: 'Leo Tolstoy',
    releaseDate: '2015',
    rating: 4
},
{
    title: 'The Lean Startup',
    author: 'Eric Ries',
    releaseDate: '2018',
    rating: 3
}

]