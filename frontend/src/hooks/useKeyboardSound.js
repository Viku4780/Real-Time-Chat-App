const keyStrokeSounds = [
    new Audio("/sound/keystroke1.mp3"),
    new Audio("/sound/keystroke2.mp3"),
    new Audio("/sound/keystroke3.mp3"),
    new Audio("/sound/keystroke4.mp3"),
];

function useKeyboardSound(){
    const playRandomKeyStrokeSound = () => {
      const randomSound = keyStrokeSounds
    }

    return {playRandomKeyStrokeSound};
}

export default useKeyboardSound;