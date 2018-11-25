import React, {Component} from 'react';
import './FogletTemplate.css';
import Navigation from '../../../shared/components/navigation/Navigation';
import {Sigma, EdgeShapes, NodeShapes} from 'react-sigma';
import {template, target, Leader} from 'foglet-template';


class UpdateSigma extends Component {
    componentWillReceiveProps({ sigma, nodes, edges }) {
        
      sigma.graph.clear()
      
      nodes.forEach(n => {
        sigma.graph.addNode(n)
      })

      sigma.refresh()

      edges.forEach(e => {
        sigma.graph.addEdge(e)
      })

      sigma.refresh()
    }
  
    render = () => null
  }

class FogletTemplate extends Component{

    constructor(props){
        super(props);

        let fogletTemplate = new template( { foglet: { overlays: [] } }, false );

        fogletTemplate.setDescriptor({
            id: fogletTemplate.foglet.inViewID,
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10)
        } );
        this.state = {
            template: fogletTemplate,
            myNode:Object.assign({
                id: fogletTemplate.foglet.inViewID,
                label:`Daniel - (${fogletTemplate.getDescriptor().x},${fogletTemplate.getDescriptor().y})`,
                x:3,
                y:6,
                size: 4,
                color: '#000'
            }, fogletTemplate.getDescriptor()),
            graph: {
                nodes:[],
                edges:[]
            }
        }
        
    }


    componentWillMount(){
        this.addNode(null, this.state.myNode)

        this.state.template.connection(null, null).then(()=>{
            
        });

        this.spawnTarget("1", {
            coordinates: { x: 5, y: 5 },
            perimeter: 100
        });

        setInterval(()=>{
            this.refresh()
        }, 2*1000)
    }


    refresh(){
        Array.from(this.state.template.foglet._networkManager._overlays.keys(), overlay=>{
            let peersN = Array.from(this.state.template.foglet.overlay(overlay)._network._rps.partialView.values());
            let nodes = peersN.map(peer=>{return {peer:peer.peer, desc:peer.descriptor}}).map(({peer, desc})=>{
                delete desc.z;
                return Object.assign({
                    id:peer,
                    label:`${desc.id} - (${desc.x},${desc.y})`,
                    size: 4,
                    color: '#000'}, desc)
            })
            let fgid = this.state.template.foglet.inViewID;
            
            nodes.push(
                Object.assign({
                    id: fgid,
                    label:`Daniel - (${this.state.template.getDescriptor().x},${this.state.template.getDescriptor().y})`,
                    size: 4,
                    color: '#000'}, this.state.template.getDescriptor())
            )
            let edges = peersN.map(peer=>peer.peer).map(peerId=>{
                return {id:`${fgid}-${peerId}`, source:fgid, target:peerId}
            })
            
            let graph = this.state.graph
            graph.nodes = nodes
            graph.edges = edges
            this.setState({
                graph:graph
            })
        })
    }

    spawnTarget(targetId, options = {}){
        if (!targetId) return console.log("please specify an id");
        const spawned = new target(targetId, options);
        const { x, y } = spawned.getCoordinates();
        this.addNode(null, {
            id: spawned.id,
            label: `p-${targetId}(${x}, ${y})`,
            x,
            y,
            size: 4,
            color: '#RFD'
          })
          this.state.template.targetSpawned(spawned);
          //const fgid = this.state.template.foglet.inViewID;
          // const edgeId = id => `${spawned.id}.${fgid}-${id}`;
        }

    onNavigation(navigation){
        switch(navigation){
            case 'up': 
                console.log('decrease y')
                this.updateNode({
                    id:"n1",
                    x:5,
                    y:40,
                })
                break;
            case 'left':
                console.log('decrease x')
                break;
            case 'right':
                console.log('increase x')
                break;
            case 'down': 
                console.log('increase y')
                break;
            default:
                console.log('Sorry, we are out of ' + navigation + '.');
        }
        
    }

    addNode(evt, node = {
        id:"n"+Math.random()*100,
        label:"da - "+Math.floor(Math.random()*10),
        x:Math.floor(Math.random()*10),
        y:Math.floor(Math.random()*10),
        size: 4,
        color: '#000'
    }){
        let graph = this.state.graph;
        graph.nodes = [...graph.nodes, node];
        
        this.setState({
            graph:graph
        });
    }

    addEdge(source, target){
        let edge = {
            id:"e"+Math.random()*100,source:source,target:target,label:`${source}-${target}`
        }
        let graph = this.state.graph;
        graph.edges = [...graph.edges, edge];
        this.setState({
            graph: graph
        });
    }

    updateNode(node){
       
        if(!node && !node.id) {
            console.log('id required')
            return;
        }
        let graph = this.state.graph;
        var updated = graph.nodes.find(e => e.id === node.id)
        if(updated){
            updated = Object.assign(updated, node)
            this.setState({
                graph:graph
            })
        } 
    }


    renderGraph(){
        // console.log(this.state.graph);
        return (
            <div>
                <Sigma graph={this.state.graph} settings={{drawEdges: true, clone: false}}>
                    <EdgeShapes default="dotted"/>
                    <NodeShapes default="diamond"/>
                    <UpdateSigma nodes={this.state.graph.nodes} edges={this.state.graph.edges}/>
                </Sigma>
            </div>
        )
    }

    render(){
        return (
            <div className="FogletTemplate">
                <p>My foglet template</p>
                {this.renderGraph()}
                <Navigation className="Navigation" onNavigation={this.onNavigation.bind(this)}/>
            </div>
        );
    }
}

export default FogletTemplate;