

/**
 * 生成层次结构图
 *  name/children
 *  isComex 是否允许节点复制,不设置
 */
export const buildSSCData=(allItem,isComex)=>{
  if(allItem!=null){
    let gindex=0
    let root={name:"Company",children:[]}
    let noRoot=[] //记录没有上级的节点
    let noParentNoChild=[] //记录独立节点
    for(let item of allItem){
      gindex++ //全局唯一ID
      let obj={id:item.itemId,typeId:item.typeId,name:item.itemName||"",children:[],itemMultiParentIds:item.itemMultiParentIds}
      if(item.itemMainParentId==null ){
        root.children.push(obj)
      }else{
        let children= findChildren(root,item.itemMainParentId)
        if(children==null){
          //没有子节点的点被忽略?
          // 等待下一次循环
          obj.kid=item.itemMainParentId
          noRoot.push(obj)
          //noRoot.push({kid:item.itemMainParentId,...obj})
        }else{
          children.push(obj)
        }
      }
      if(item.itemMultiParentIds!=null){
        let arr=parseStringToArray(item.itemMultiParentIds)
        for(let childID of arr){
          let children= findChildren(root,childID)
          if(children==null){
            //noRoot.push({kid:item.itemMainParentId,...obj})
          }else{
            if(isComex==true){
              children.push({...obj,children:[],id:item.itemId+"/"+gindex+Math.random()})
            }else if(isComex===false){
              children.push({...obj,children:[],id:item.itemId, })
            }else if(isComex===undefined){
              //doNothing
            }
           // let oid=isComex?item.itemId:item.itemId+"/"+gindex+Math.random()
            //生成新节点,复制一个新的
           // children.push({...obj,id:oid, children:[], })
            //使用旧节点
            //obj.id=oid
            //obj.children=[]
            //children.push(obj)
          }
          // children.push({id:item.itemId,name:item.itemName||"",children:[],itemMultiParentIds:item.itemMultiParentIds})
        }

      }
    }
    /*二次循环防止漏点*/
    for(let ia of noRoot){
      let children= findChildren(root,ia.kid)
      if(children!=null){
        children.push(ia)
      }
    }
    /*清理重名交叉情况的节点*/
    if(isComex){

    }


   // return root.children  //没有根节点
    return [root]  //有根节点
    return [root,...noRoot]  //有根节点,多级无根节点
    return [root,{...root}]  //多重复制的结果
  }

}


const findChildren=(obj,id)=>{
  if(obj.id==id)return obj.children
  else{
    if(obj.children !=null ){
      for(let s of obj.children){
        let out=findChildren(s,id)
        if( out!=null) return out
      }
    }
  }
}

/* 多项值转义*/
const parseStringToArray=(text)=>{
  if(text==null|| text=="" ||text.trim()==""){
    return []
  }else{
    return text.split(",")
  }
}
