import menuData from "@/data/menu-data";
import Link from "next/link";

export default function MainMenu() {
  return (
    <nav className="main-menu d-none d-xl-block">
      <ul>
        {menuData.map((item, index) => (
          <li
            key={index}
            className={item.children ? 'menu-item-has-children' : ''}
          >
            <Link href={item.href}>{item.title}</Link>
            {item.children && (
              <ul
                className={`dp-menu ${item.title === 'Home' ? 'col-2' : ''
                  }`}
              >
                {item.children.map((child, childIndex) => (
                  <li key={childIndex}>
                    <Link href={child.href}>{child.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
