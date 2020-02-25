import {ADD_ARTICLE, SIGN_IN} from "../constants/action-types";

export function addArticle(payload) {
    return { type: ADD_ARTICLE, payload }
};

export function signIn(payload) {
    return { type: SIGN_IN, payload }
};