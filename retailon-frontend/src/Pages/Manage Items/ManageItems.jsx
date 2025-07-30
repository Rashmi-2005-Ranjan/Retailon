import "./ManageItems.css"
import ItemForm from "../../Components/Item Form/ItemForm.jsx";
import ItemList from "../../Components/Item List/ItemList.jsx";

const ManageItems = () => {
    return (
        <>
            <div className="items-container text-light">
                <div className="left-column">
                    <ItemForm/>
                </div>
                <div className="right-column">
                    <ItemList/>
                </div>
            </div>
        </>
    )
}
export default ManageItems