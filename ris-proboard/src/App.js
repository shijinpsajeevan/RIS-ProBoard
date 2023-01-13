import StoreInfo from './components/StoreInfo/storeInfo';
import DynamicStoreInfo from './components/StoreInfo/dynamicStoreInfo';
import { useSelector} from "react-redux";

import {set_str_adv_filter} from "../src/redux/storeFilter";

// importing Store Redux

function App() {

  const adv_filter = useSelector((state) => state.counter1.str_adv_filter);

  return (
    <div>
      {adv_filter?<DynamicStoreInfo/>:<StoreInfo/>}
    </div>
  );
}
export default App;
