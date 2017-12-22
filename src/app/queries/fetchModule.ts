import gql from 'graphql-tag';

export default gql`
    query fetchModule( $id: ID!){
        module(id: $id){
            _id
            name
            bodytext
            price
            tstamp
            
        }
    }
`;
