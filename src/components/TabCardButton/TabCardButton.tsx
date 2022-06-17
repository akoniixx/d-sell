import React from 'react'

interface TabCardButtonProp {
    labels: { nameMenu: string, numMenu: number }[],
}
export const TabCardButton: React.FC<TabCardButtonProp> = ({
    labels,
}) => {

    const tab: number = 1

    const showActiveTabMenu = (index: number) => {
        if (tab == index) {
            return "nav-link active"
        }
        else {
            return "nav-link"
        }
    }
    return (
        <>
            <ul className="nav flex-column nav-pills">
                {labels.map((l) =>
                    <li className="nav-item mb-2">
                        <a className={showActiveTabMenu(l.numMenu)}
                            data-toggle="tab"
                            id={"teb-product-info-" + l.numMenu}
                            href={"#product-info-" + l.numMenu}>
                            <span className="nav-icon">
                                <i className="flaticon2-file"></i>
                            </span>
                            <span className="nav-text">{l.nameMenu}</span>
                        </a>
                    </li>
                )}
            </ul>
        </>
    )
}
