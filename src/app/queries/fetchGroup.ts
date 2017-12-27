import gql from 'graphql-tag';

export default gql`
    query fetchGroup( $id: ID!) {
        group (id: $id){
            _id
            name
            subTotal
            tstamp
        }
    }
`;
