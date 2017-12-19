import gql from 'graphql-tag';

export default gql`
    mutation AddModule($name: String!, $bodytext: String!, $price: Int!, $groupId: String) {
        addModule(name: $name, bodytext: $bodytext, price: $price, groupId: $groupId ){
            name
        }
    }
`;
