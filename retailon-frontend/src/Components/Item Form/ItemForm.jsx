import {useContext, useState} from "react";
import {assets} from "../../assets/assets.js";
import {AppContext} from "../../Context/AppContext.jsx";
import toast from "react-hot-toast";
import {addItem} from "../../Services/ItemService.js";

const ItemForm = () => {
    const {categories, setItemsData, itemsData, setCategories} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        categoryId: "",
        price: "",
        description: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(
            (prevData) => ({
                ...prevData,
                [name]: value
            })
        )
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("item", JSON.stringify(data));
        formData.append("file", image);
        try {
            if (!image) {
                toast.error("Please select an image");
            } else {
                const response = await addItem(formData);
                if (response.status === 201) {
                    setItemsData([...itemsData, response.data]);
                    setCategories((prevCategories)=> prevCategories.map((categories)=>categories.categoryId === data.categoryId ? {
                        ...categories,
                        items: categories.items + 1
                    } : categories
                    ))
                    toast.success("Item added successfully");
                    setData({
                        name: "",
                        categoryId: "",
                        price: "",
                        description: ""
                    });
                    setImage(false);
                } else {
                    console.error("Failed to add item:", response);
                    toast.error("Failed to add item");
                }
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("An error occurred while adding the item");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="item-form-container" style={{height: "100vh", overflowY: "auto", overflowX: "hidden"}}>
            <div className="mx-2 mt-2">
                <div className="row">
                    <div className="card col-md-12 form-container">
                        <div className="card-body">
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label cursor-pointer">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload} alt=""
                                             width={48}/>
                                    </label>
                                    <input type="file" name="image" id="image" className="form-control" hidden
                                           onChange={(e) => setImage(e.target.files[0])}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        placeholder="Item name"
                                        onChange={onChangeHandler}
                                        value={data.name}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="category">
                                        Category
                                    </label>
                                    <select required className="form-control" name="categoryId" id="category"
                                            onChange={onChangeHandler} value={data.categoryId}>
                                        <option value="">---SELECT CATEGORY---</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form-control"
                                        placeholder="&#8377; 200.00"
                                        onChange={onChangeHandler}
                                        value={data.price}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        rows="5"
                                        type="text"
                                        name="description"
                                        id="description"
                                        className="form-control"
                                        placeholder="Write Content here..."
                                        onChange={onChangeHandler}
                                        value={data.description}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-warning w-100"
                                        disabled={loading}>{loading ? "Loading..." : "Save"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemForm;