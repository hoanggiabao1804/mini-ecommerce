import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/share/AdminLayout/AdminLayout";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { Products } from "./pages/products/Products";
import { Placeholder } from "./pages/placeholder/Placeholder";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<AdminLayout />}>
					<Route
						index
						element={<Navigate to="/dashboard" replace />}
					/>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="products" element={<Products />} />
					<Route path=":section" element={<Placeholder />} />
					<Route
						path="*"
						element={<Navigate to="/dashboard" replace />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
