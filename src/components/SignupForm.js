import React, { useState, useEffect } from "react";
import formSchema from "../formSchema";
import axios from "axios";
import * as yup from "yup";
import {axiosWithAuth} from "../utils/axiosWithAuth";
import { useHistory } from "react-router-dom";
import styled from "styled-components";


const StyledSignupFrom = styled.div`
    .form-labels {
        border: 3px solid ${({ theme }) => theme.secondaryColor};
        background-color: ${({ theme }) => theme.secondaryColor};
    }
    label {
        display: flex;
        justify-content: center;
        padding: ${({ theme }) => theme.space};
    }

    button {
        border: 4px solid ${({ theme }) => theme.primaryColor};
        border-radius: 20px;
        color: ${({ theme }) => theme.primaryColor};
        background-color: ${({ theme }) => theme.offWhite};
        font-weight: bold;

        &:hover {
            color: ${({ theme }) => theme.offWhite};
            background-color: ${({ theme }) => theme.primaryColor};
            transition: all 0.3s ease-in-out;
        }
    }
`



const SignupForm = () => {

    const history = useHistory();


    const initialFormValues = {
        username: "",
        password: ""
    }

    const initialFormErrors = {
        username: "",
        password: ""
    }


    const [formValues, setFormValues] = useState(initialFormValues);
    const [formErrors, setFormErrors] = useState(initialFormErrors);
    const [disabled, setDisabled] = useState(true);
    const [text, setText] = useState("");

    useEffect(() =>{
        formSchema.isValid(formValues)
            .then(valid => {
                setDisabled(!valid)
            })
    }, [formValues])


    const inputChange = event => {
        const { name, value } = event.target;
        setText(value);
        yup
            .reach(formSchema, name)
            .validate(value)
            .then(valid => {
                setFormErrors({
                    ...formErrors,
                    [name]: ""
                })
            })
            .catch(error => {
                setFormErrors({
                    ...formErrors,
                    [name]: error.errors[0]
                })
            })
        setFormValues({
            ...formValues,
            [name]: value
        })
    }

    const submit = event => {
        event.preventDefault();
        const newUser ={
            username: formValues.username.trim(),
            password: formValues.password.trim(),
            role: 1
        }
        axios.post("https://better--professor.herokuapp.com/auth/login", newUser)
            .then(response => {
                console.log(response)
                history.push("/login");
            })
    }

console.log(text.length)

    return(
        <>
            <h1>Sign Up</h1>
                <form onSubmit={submit}>
                    <div className="errors">
                        <div>{formErrors.username}</div>
                        <div>{formErrors.password}</div>
                    </div>
                    <StyledSignupFrom>
                        <div className="form-labels">
                            <div>
                                <label> Username:
                                    <input 
                                    value={formValues.username}
                                    onChange={inputChange}
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    />                
                                </label>
                            </div>
                            <div>
                                <label> Password:
                                    <input 
                                    value={formValues.password}
                                    onChange={inputChange}
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    />
                                </label>
                            </div>
                        </div>
                            <div>
                                <button disabled={disabled}>Submit</button>
                            </div>
                    </StyledSignupFrom>
                    </form>
        </>
    )
}

export default SignupForm;