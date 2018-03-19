import gql from 'graphql-tag';

export default gql`
    mutation UpdateSealer($id: ID!, $position: String, $name: String!, $email: String!, $phone: String, $mobile: String) {
        editSealer(id: $id, position: $position, name: $name, email: $email, phone: $phone, mobile: $mobile, ){
            name
        }
    }
`;
