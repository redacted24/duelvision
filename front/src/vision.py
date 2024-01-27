import mediapipe as mp
import cv2 as cv
import base64
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
#asdf = "------------------"
def image(file):
    with open(file, "rb") as base64_file:
        arr = np.frombuffer(base64.b64decode(base64_file.read()), np.uint8)
        frame = cv.flip(cv.imdecode(arr, cv.IMREAD_COLOR), 1)
        with mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5) as hands:
            #print(asdf, frame)
            image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            #print(asdf, image)
            results = hands.process(image)
            
            image.flags.writeable = True
            image = cv.cvtColor(image, cv.COLOR_RGB2BGR)
            if results.multi_hand_landmarks:
                for landmark in results.multi_hand_landmarks:
                    print(landmark)
                    mp_drawing.draw_landmarks(image, landmark, mp_hands.HAND_CONNECTIONS)
            
            cv.imshow('Image', cv.flip(image, 1))
            cv.waitKey(0)

def video():
    cam = cv.VideoCapture(0)
    with mp_hands.Hands(model_complexity=0, min_tracking_confidence=0.5, max_num_hands=1, min_detection_confidence=0.5) as hands:
        while cam.isOpened():
            success, frame = cam.read()
            if not success:
                continue
            
            image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            results = hands.process(image)
            
            image.flags.writeable = True
            image = cv.cvtColor(image, cv.COLOR_RGB2BGR)
            if results.multi_hand_landmarks:
                for landmark in results.multi_hand_landmarks:
                    print(landmark)
                    mp_drawing.draw_landmarks(image, landmark, mp_hands.HAND_CONNECTIONS)
            
            cv.imshow('Video', cv.flip(image, 1))
            
            if cv.waitKey(10) & 0xFF == ord('q'):
                break
        cam.release()
        cv.destroyAllWindows()