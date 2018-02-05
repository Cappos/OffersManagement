import gql from 'graphql-tag';

export default gql`
    mutation UpdatePage($id: ID!, $title: String!, $subtitle: String, $bodytext: String) {
        editPage(id: $id, title: $title, subtitle: $subtitle, bodytext: $bodytext){
            title
        }
    }
`;
