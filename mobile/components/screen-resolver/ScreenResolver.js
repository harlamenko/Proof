import { useEffect, useContext } from "react";
import { AuthContext } from '../../context';

export default () => {
    const { tryLocalSignin } = useContext(AuthContext);

    useEffect(() => {
        tryLocalSignin();
    }, [])

    return null;
}