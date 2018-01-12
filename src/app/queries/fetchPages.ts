import gql from 'graphql-tag';

export default gql`
    {
        pages {
            _id
            type
            title
            subtitle
            bodytext
            tstamp
        }
    }

`;
