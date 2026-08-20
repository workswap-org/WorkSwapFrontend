import Modal from "@core/components/ui/Modal/Modal"
import { ICategory } from "@core/lib/category/types";
import { ListingTypeValue } from "@core/lib/listing/constants/listingTypes";
import { useState } from "react"

const CategoryCreateModal = ({type, parentCategory}: { type: ListingTypeValue, parentCategory: ICategory | null }) => {

    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <Modal isOpen={isOpen} onClose={() => setOpen(false)} title={"Создать категорию"}>
            <div className="form-group">
                <label htmlFor="permissionName">Имя:</label>
                <span>(на англиском, заглавными буквами)</span>
                <br/>
                <span>Тип категории: {type}</span>
                <br/>
                {parentCategory ? (
                    <span>Родительская категория: {parentCategory.name}</span>
                ) : (
                    <span>Вы создаёте корневую категорию</span>
                )}
                <input
                    type="text"
                    id="permissionName"
                    name="permissionName"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-actions" onClick={() => createPerm()}>
                <button className="btn btn-outline-primary">Сохранить</button>
            </div>
        </Modal>
    )
}

export default CategoryCreateModal;