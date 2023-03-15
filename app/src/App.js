import { Routes, Route } from "react-router-dom";

// Import styling.
import './styles/App.css'
import Homepage from "./components/pages/Homepage";
import Partner from "./components/pages/Partner";
import PartnerEditItem from "./components/pages/PartnerEditItem";
import Layout from "./components/layout/Layout";
import Editorial from "./components/pages/Editorial";
import CheckItem from "./components/pages/CheckItem";
import SuggestChanges from "./components/pages/SuggestChanges";

/**
 * App is responsible for loading data and routing to other pages.
 *
 * @author Szymon Jedrzychowski
 */
function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/partner" element={<Partner/>}/>
          <Route path="/partnerEditItem" element={<PartnerEditItem/>}/>
          <Route path="/editorial" element={<Editorial/>}/>
          <Route path="/checkItem" element={<CheckItem/>}/>
          <Route path="/suggestChanges" element={<SuggestChanges/>}/>
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
