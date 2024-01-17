interface ILink {
    root:string;
    name:string;
    image:string;
}

export const leftSideBarLinks:ILink[] = [
    {root:"/", name:'Home',image:"/assets/icons/home.svg"},
    {root:"/explore", name:'Explore',image:"/assets/icons/wallpaper.svg"},
    {root:"/all-users", name:'People',image:"/assets/icons/people.svg"},
    {root:"/saved", name:'Saved',image:"/assets/icons/save.svg"},
    {root:"/create-post", name:'Create Post',image:"/assets/icons/gallery-add.svg"}
]

export const bottomBarLinks:ILink[] = [
    {root:"/", name:'Home',image:"/assets/icons/home.svg"},
    {root:"/explore", name:'Explore',image:"/assets/icons/wallpaper.svg"},
    {root:"/saved", name:'Saved',image:"/assets/icons/save.svg"},
    {root:"/create-post", name:'Create Post',image:"/assets/icons/gallery-add.svg"}
]