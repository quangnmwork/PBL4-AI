import io
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from torchvision import datasets, transforms, models
from PIL import Image

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(device)

Labels = {
    0: "ClickMode",
    1: "Continue",
    2: "Fan",
    3: "Light",
    4: "Off",
    5: "On",
    6: "One",
    7: "Stop",
    8: "Two",
}

pretrain_model = models.resnet18()
pretrain_model.fc = nn.Sequential(nn.Dropout(0.5), nn.Linear(512, 9))
path_model_pretrain = "hand_model18.pt"

pretrain_model.to(device)
pretrain_model.load_state_dict(
    torch.load(path_model_pretrain, map_location=device), strict=False
)
pretrain_model.eval()


def transform_image(image_bytes):
    transform = transforms.Compose(
        [
            transforms.Resize((240, 240)),
            transforms.ToTensor(),
            transforms.Normalize([0.5345, 0.5550, 0.5419], [0.2360, 0.2502, 0.2615]),
        ]
    )
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.transpose(method=Image.FLIP_LEFT_RIGHT)
    return transform(image).unsqueeze(0)


def get_prediction(image):
    image.to(device)
    output = pretrain_model(image)

    _, predictions = torch.max(output.data, 1)
    prob = F.softmax(output, dim=1)
    top_p, _ = prob.topk(1, dim=1)
    return Labels[predictions.item()], top_p.item()
