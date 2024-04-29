// import * as React from 'react';

// export interface IFormProps {
//     // Define any props you need
// }

// export interface IFormState {
//     title: string;
//     description: string;
// }

// export default class SimpleForm extends React.Component<IFormProps, IFormState> {
//     constructor(props: IFormProps) {
//         super(props);
//         this.state = {
//             title: '',
//             description: ''
//         };
//     }

//     private handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         this.setState({ title: event.target.value });
//     };

//     private handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//         this.setState({ description: event.target.value });
//     };

//     private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         // Handle the form submission logic here
//         console.log('Form submitted:', this.state);
//     };

//     public render() {
//         return (
//             <form onSubmit= { this.handleSubmit } >
//             <div>
//             <label htmlFor="title" > Title: </label>
//                 < input
//         id = "title"
//         type = "text"
//         value = { this.state.title }
//         onChange = { this.handleTitleChange }
//             />
//             </div>
//             < div >
//             <label htmlFor="description" > Description: </label>
//                 < textarea
//         id = "description"
//         value = { this.state.description }
//         onChange = { this.handleDescriptionChange }
//             />
//             </div>
//             < button type = "submit" > Submit < /button>
//                 < /form>
//     );
//     }
// }