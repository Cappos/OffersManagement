import gql from 'graphql-tag';

export default gql`
    mutation AddSealer($position: String, $name: String!, $email: String!, $phone: String, $mobile: String, $value: Int!) {
        addSealer(position: $position, name: $name, email: $email, phone: $phone, mobile: $mobile, value: $value){
            _id,
            position
            name
            email
            phone
            mobile
            value
        }
    }
`;
