import React, { PropTypes } from 'react'
import { Breadcrumb, Icon } from 'antd'
import styles from './layout.less'

let pathSet = []
const getPathSet = function (menuArray, parentPath) {
  parentPath = parentPath || '/'
  menuArray.map(item => {
    pathSet[(parentPath + item.key).replace(/\//g, '-')] = {
      path: parentPath + item.key,
      name: item.name,
      icon: item.icon || '',
      clickable:item.clickable==undefined?true:false
    }
    if (!!item.child) {
      getPathSet(item.child, parentPath + item.key + '/')
    }
  })
}


const fileStar=(name,obj)=>{
  if(obj[name]!=null) return;
  for(let n in obj){
    let reg=n.replace("-","");
    //if(obj[name])
    if(name.match(reg)){
      obj[name]=obj[n];

    }
  }

}
function Bread({ location,menu }) {
  getPathSet(menu);
  let pathNames = []
  location.pathname.substr(1).split('/').map((item, key) => {
    if (key > 0) {
      pathNames.push((pathNames[key - 1] + '-' + item))
    } else {
      pathNames.push(('-' + item))
    }
  })
  const breads = pathNames.map((item, key) => {
 //   fileStar(item,pathSet);
    return (
      <Breadcrumb.Item key={key} {...((pathNames.length - 1 == key)||!pathSet[item].clickable)? '' : { href: '#' + pathSet[item].path }}>
        {pathSet[item]&&pathSet[item].icon
          ? <Icon type={pathSet[item].icon} />
          : ''}
        <span>{pathSet[item]&&pathSet[item].name}</span>
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {/*<Breadcrumb.Item href="#/"><Icon type="home" /><span>主页</span></Breadcrumb.Item>*/}
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  location: PropTypes.object,
}

export default Bread
