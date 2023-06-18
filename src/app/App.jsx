import Provider from './providers';
import { AuthContext } from '../Context';
import { useToken } from '../shared/hooks';
import "./styles/index.scss"

const App = () => {
	const { token, addToken, removeToken } = useToken();

	return (
		<AuthContext.Provider value={{ token, addToken, removeToken }}>
			<Provider.Router/>
		</AuthContext.Provider>
	)
}

export default App
