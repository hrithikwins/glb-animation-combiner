import { useState, useEffect } from 'react'
import { Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import styles from './App.module.css'

// const modelPath =
const animations = {
  Idle: '/animations/idle.glb',
  Walking: '/animations/walk.glb',
  WalkingBackwards: '/animations/walkBack.glb',
  LeftStrafeWalk: '/animations/walkLeft.glb',
  RightStrafeWalk: '/animations/walkRight.glb',
  Running: '/animations/run.glb',
  RunningBackward: '/animations/runBack.glb',
  LeftStrafe: '/animations/runLeft.glb',
  RightStrafe: '/animations/runRight.glb',
  Flying: '/animations/fly.glb',
  Dancing: '/animations/rumba-dancing2.glb'
}
const gltfName = 'Armature'

export default function App(): JSX.Element {
  const [isFromFile, setIsFromFile] = useState<boolean>(true)
  const [modelPath, setModelPath] = useState<string>(
    'https://models.readyplayer.me/631f06543a656b9c323876b4.glb'
  )
  const [userAnimations, setUserAnimations] = useState<[]>([])
  //   useEffect(() => {
  //     alert('Hello')
  //   }, [isButtonClicked])

  function getTheAnimation(modelPath: string): void {
    alert('Processing started')
    combineAnimations(modelPath).catch(console.error)
  }

  //   const onAnimationUpload = (event) => {
  //     if (event.target.files.length) {
  //       Array.from(event.target.files).forEach((element) => {
  //         let fileUrl = URL.createObjectURL(element)
  //         let fileExt = element.name.split('.').pop()
  //         loadModel(fileUrl, fileExt, (object) => {
  //           let fileName = element.name.split('.')[0].replace(/\s/g, '')
  //           fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
  //           if (object.animations.length > 1) {
  //             object.animations.forEach((anim, index) => {
  //               anim.name = fileName + index
  //             })
  //           } else {
  //             if (object.animations[0].name === 'Take 001') {
  //               object.animations[0].name = 'T-Pose (No Animation)'
  //             } else {
  //               object.animations[0].name = fileName
  //             }
  //           }
  //           setAnimations((animations) => [...animations, object.animations])
  //           console.log('animations', animations)
  //           console.log('object.animations', object.animations)
  //         })
  //       })
  //     }
  //   }

  return (
    <>
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <h1>GLTF Animation Combiner</h1>
            <p className={styles.subHeading}>By Juuinini</p>
          </div>
          <div className={styles.body}>
            {/* the selector */}
            <div className={styles.buttonGroup}>
              <div
                onClick={() => setIsFromFile(true)}
                className={
                  styles.homeButton + ' ' + (isFromFile ? styles.isHomeActive : '')
                }
              >
                From File
              </div>
              <div
                onClick={() => setIsFromFile(false)}
                className={
                  styles.homeButton + ' ' + (!isFromFile ? styles.isHomeActive : '')
                }
              >
                From Url
              </div>
            </div>
            <div className={styles.formContainer}>
              {isFromFile ? (
                <input className={styles.inputBox} type="file" name="readyPlayerMe" />
              ) : (
                <>
                  {/* <input
                    className={styles.inputBox}
                    type="file"
                    name="animationFile"
                    onChange={onAnimationUpload}
                    accept=".fbx"
                  /> */}

                  <input
                    className={styles.inputBox}
                    type="url"
                    value="https://models.readyplayer.me/631f06543a656b9c323876b4.glb"
                    onChange={(e) => setModelPath(e.target.value)}
                    name="readyPlayerMe"
                    placeholder="Enter Ready Player Me URL"
                  />
                </>
              )}
            </div>
            {/* list of checkboxes */}
            <div className={styles.checkboxContainer}>
              {Object.keys(animations).map((animation: string, index: number) => {
                return (
                  <div className={styles.checkbox} key={animation + index.toString()}>
                    <input
                      type="checkbox"
                      className={styles.checkboxElement}
                      name={animation}
                      id={animation}
                    />
                    <label className={styles.checkboxTitle} htmlFor={animation}>
                      {animation}
                    </label>
                    <br />
                  </div>
                )
              })}
            </div>
            {/* the button */}
            <div className={styles.homeButton} onClick={() => getTheAnimation(modelPath)}>
              Download
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function combineAnimations(modelPathName: string): Promise<void> {
  const gltfLoader = new GLTFLoader()
  const gltfExporter = new GLTFExporter()
  const group = new Group()

  group.name = gltfName

  const gltf = await asyncGltfLoad(gltfLoader, modelPathName)
  group.add(gltf.scene)

  await loadAnimations(group, animations)

  gltfExporter.parse(
    gltf.scene,
    (glb) => download(glb as ArrayBuffer, modelPathName),
    console.error,
    { binary: true, animations: group.animations }
  )
}

async function loadAnimations(group: Group, animations: Object): Promise<void> {
  const gltfLoader = new GLTFLoader()

  for (const [name, path] of Object.entries(animations)) {
    const gltf = await asyncGltfLoad(gltfLoader, path)
    // if (gltf.animations.length > 1) {
    //   gltf.animations.forEach((anim, index) => {
    //     anim.name = name + index.toString()
    //   })
    // } else {
    gltf.animations[0].name = name
    group.animations.push(gltf.animations[0])
    console.log(gltf.animations[0])
    // }
  }
}

function download(arrayBuffer: ArrayBuffer, fileName: string): void {
  const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}

async function asyncGltfLoad(gltfLoader: GLTFLoader, path: string): Promise<GLTF> {
  return await new Promise((resolve, reject) => {
    gltfLoader.load(path, resolve, undefined, reject)
  })
}
