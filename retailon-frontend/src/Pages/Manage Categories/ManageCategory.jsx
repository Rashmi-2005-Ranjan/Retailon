import "./ManageCategory.css"
import CategoryForm from "../../Components/Category Form/CategoryForm.jsx";
import CategoryList from "../../Components/Category List/CategoryList.jsx";

const ManageCategory = () => {
    return (
        <>
            <div className="category-container text-light">
                <div className="left-column">
                    <CategoryForm/>
                </div>
                <div className="right-column">
                    <CategoryList/>
                </div>
            </div>
        </>
    )
}
export default ManageCategory;