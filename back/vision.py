import mediapipe as mp
import cv2 as cv
import base64
import numpy as np
import time


mp_drawing = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands
def image(b64_string):
    a = time.time()
    arr = np.frombuffer(base64.b64decode(b64_string), np.uint8)
    frame = cv.flip(cv.imdecode(arr, cv.IMREAD_COLOR), 1)
    b = time.time()
    print("base64 process",1/(b-a))
    with mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5) as hands:
        image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        image.flags.writeable = False
        
        a = time.time()
        results = hands.process(image)
        
        b = time.time()
        print("process hands",1/(b-a))

        a = time.time()
        image.flags.writeable = True
        image = cv.cvtColor(image, cv.COLOR_RGB2BGR)
        all_landmarks = []
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(image, hand, mp_hands.HAND_CONNECTIONS)
                for landmark in hand.landmark:
                    all_landmarks.append([landmark.x, landmark.y])
        b = time.time()
        print("getting landmarks",1/(b-a))
        #cv.imshow('Image', cv.flip(image, 1))
        #cv.waitKey(0)
        return(all_landmarks)

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
