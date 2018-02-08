import gql from 'graphql-tag';

export default gql`
    {
        categories{
            _id
            name
            value
        }
        
        prices{
            _id
            value
        }
    }
`;
