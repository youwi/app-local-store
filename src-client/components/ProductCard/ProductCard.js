import React, { PropTypes } from 'react'
import { Menu, Icon, Button ,Row,Col,Card} from 'antd'
import { Link } from 'dva/router'
import styles from './ProCard.less'
import _ from "lodash";

const COL_COUNT=5 //每行的数量
export default function ProCard({ cardList,selectProject}) {
  let rowlist = _.chunk(cardList,COL_COUNT);

  let widthLevel=4
  let widthStyle={}
  if(document.body.clientWidth<1500){
    widthLevel=5
    widthStyle.width="18%"
  }

  return (
    <div className={styles.project} >
      <div style={{ background: 'rgba(236, 236, 236, 0)', padding: '0px' }}>
        {
          rowlist&&rowlist.map((row,i)=>{
              fillArray(row,COL_COUNT)//row.length=COL_COUNT;
              return  <Row type="flex" justify="center" align="middle" key={i}>
              {
                row&&row.map&&row.map((card,j)=>{
                  patchImgUrl(card)
                  return <Col span={widthLevel} key={i+"-"+j+"-"+card.id} className={"CardFix"} style={widthStyle}>
                    {
                    card?<div className="box">
                      <div className="info">

                        <Link to={card.link} onClick={ ()=>selectProject(card.projectShortName)}>
                          <div className="image"  style={{backgroundImage:card.imgUrl}}>
                            {
                              !card.imgUrl&&
                            <div style={{display:"flex",alignItems:"center",height: "inherit"}}>
                              <div style={{display:"flex",alignItems: "center",flexDirection:"column",width: "100%"}}>
                                <i className="fa fa-file-image-o fa-5x" aria-hidden="true"/>
                              </div>
                            </div>
                            }
                          </div>
                          <div className="title">{card.projectName}</div>
                          {/*<div className="intro">{card.projectDesc}</div>*/}
                        </Link>
                      </div>
                      {/*<div className="status">4月前更新<span className="creator">admin</span></div>*/}
                      <div className="tools">
                        <i className="glyphicon glyphicon-bookmark tomark"  />
                        <i className="glyphicon glyphicon-plus tomarki"  />
                      </div>
                    </div>:null
                  }
                  </Col>
                })
              }
            </Row>
          }
          )
        }

      </div>
    </div>
  )
}
const fillArray=(array,count)=>{
  if(array.length<count){
    for(let k =array.length;k<count;k++){
      array[k]=false;
    }
  }
}
/**
 * 按内置名单补充图片,如果没有的话.
 * @param card
 */
const patchImgUrl=(card)=>{
  let keyList=[ "今日笋盘","悟空找房", "新悟空通行证","有房有客","孙行者","悟空通行证","新房助手","法务助手"]

  if(card.projectName&& card.imgUrl==null){
    for(let key of keyList){
      if(card.projectName.indexOf(key)>-1   ){
        card.imgUrl= "url(cdn/"+key+".jpg)";
        break;
      }else{

      }
    }
    // if(card.projectName.indexOf("wkzf")>-1 || card.projectName.indexOf("悟空找")>-1  ){
    //   card.imgUrl= "url(http://appds.wkzf/cdn/悟空找房.jpg";
    // }
    // if(card.projectName.indexOf("yfyk")>-1 || card.projectName.indexOf("有房有")>-1  ){
    //   card.imgUrl= "url(http://appds.wkzf/cdn/有房有客.jpg";
    // }
    // if(card.projectName.indexOf("sun")>-1 || card.projectName.indexOf("孙行者")>-1  ){
    //   card.imgUrl= "url(http://appds.wkzf/cdn/孙行者.jpg";
    // }
  }
}

ProCard.propTypes={
  cardList:PropTypes.array
}
//   {/*<Card title={card.projectName} bordered={false}>{card.projectDesc}</Card>*/}

