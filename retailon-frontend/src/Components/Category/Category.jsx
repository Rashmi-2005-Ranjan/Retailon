import "./Category.css"

const Category = ({categoryName, imgUrl, numberOfItems, bgColor, isSelected, onClick}) => {
    return (
        <div className="d-flex align-items-center p-3 rounded gap-1 position-relative category-hover cursor-pointer"
             style={{backgroundColor: bgColor, height: '100px', width: '100%'}}
             onClick={onClick}
        >
            <div style={{position: 'relative', marginRight: '15px'}}>
                <img src={imgUrl} alt={categoryName} className="category-image"/>
            </div>
            <div>
                <h6 className="text-white mb-0">{categoryName}</h6>
                <p className="text-white mb-0">{numberOfItems} items</p>
            </div>
            {isSelected && <div className="active-category"></div>}
        </div>
    )
}

export default Category;